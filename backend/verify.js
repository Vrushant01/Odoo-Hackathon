const mongoose = require('mongoose');
const assert = require('assert');
const app = require('./app');
const User = require('./src/models/User');
const Vehicle = require('./src/models/Vehicle');
const Driver = require('./src/models/Driver');
const Trip = require('./src/models/Trip');
const Maintenance = require('./src/models/Maintenance');
const FuelLog = require('./src/models/FuelLog');
const Expense = require('./src/models/Expense');
const Notification = require('./src/models/Notification');
const Settings = require('./src/models/Settings');

const TEST_PORT = 5001;
const BASE_URL = `http://localhost:${TEST_PORT}/api/v1`;
const MONGODB_URI = 'mongodb://localhost:27017/transitops-test';

let server;

async function runTests() {
  console.log('--- Connecting to Test Database ---');
  await mongoose.connect(MONGODB_URI);
  await mongoose.connection.db.dropDatabase();
  console.log('Test database dropped and reconnected.');

  // 1. Seed Roles and Users
  console.log('Seeding test users...');
  
  // Seed Fleet Manager
  const manager = new User({
    fullName: 'Alice Manager',
    email: 'manager@transitops.com',
    password: 'password123',
    role: 'Fleet Manager',
    phoneNumber: '+15550101',
    status: 'Active'
  });
  await manager.save();

  // Seed Dispatcher
  const dispatcher = new User({
    fullName: 'Bob Dispatcher',
    email: 'dispatcher@transitops.com',
    password: 'password123',
    role: 'Dispatcher',
    phoneNumber: '+15550202',
    status: 'Active'
  });
  await dispatcher.save();

  console.log('Test users seeded.');

  // 2. Start Express server
  console.log(`Starting test server on port ${TEST_PORT}...`);
  server = app.listen(TEST_PORT);
  console.log('Test server started.');

  // Helper for HTTP requests using native fetch
  const request = async (url, options = {}) => {
    const res = await fetch(url, options);
    const text = await res.text();
    let body = null;
    try {
      body = JSON.parse(text);
    } catch (e) {}
    return { status: res.status, body, text, headers: res.headers };
  };

  // 3. Authenticate and get tokens
  console.log('\nTesting Authentication endpoints...');
  
  // Fleet Manager Login
  const loginResManager = await request(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'manager@transitops.com', password: 'password123' })
  });
  assert.strictEqual(loginResManager.status, 200);
  const managerToken = loginResManager.body.data.token;
  console.log('✓ Fleet Manager authenticated successfully.');

  const headersManager = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${managerToken}`
  };

  const headersDispatcher = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${(await request(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'dispatcher@transitops.com', password: 'password123' })
    })).body.data.token}`
  };

  // ==================== SEED OPERATION DATA ====================
  console.log('\n==================== SEEDING SYSTEM DATA ====================');
  
  // 1. Vehicle
  const vehRes = await request(`${BASE_URL}/vehicles`, {
    method: 'POST',
    headers: headersManager,
    body: JSON.stringify({
      registrationNumber: 'TX-8899-E2E',
      vehicleName: 'Volvo FH16 Big Rig',
      vehicleModel: 'FH16 750',
      vehicleType: 'Truck',
      fuelType: 'Diesel',
      maximumLoadCapacity: 25000,
      currentOdometer: 12000,
      purchaseDate: '2026-01-15',
      region: 'North'
    })
  });
  const vehicleId = vehRes.body.data._id;

  // 2. Driver
  const drRes = await request(`${BASE_URL}/drivers`, {
    method: 'POST',
    headers: headersManager,
    body: JSON.stringify({
      fullName: 'John Driver',
      email: 'john@transitops.com',
      phoneNumber: '+15559876',
      licenseNumber: 'TX-CDL-9999',
      licenseCategory: 'Commercial',
      licenseExpiryDate: '2028-12-31',
      safetyScore: 95.5,
      status: 'Available',
      region: 'North'
    })
  });
  const driverId = drRes.body.data._id;

  // 3. Completed Trip
  const tripRes = await request(`${BASE_URL}/trips`, {
    method: 'POST',
    headers: headersManager,
    body: JSON.stringify({
      vehicle: vehicleId,
      driver: driverId,
      source: 'Houston, TX',
      destination: 'Dallas, TX',
      cargoDescription: 'Machinery',
      cargoWeight: 18000,
      plannedDistance: 240,
      priority: 'High',
      dispatchDate: '2026-07-15T08:00:00Z'
    })
  });
  const tripId = tripRes.body.data._id;
  
  // Dispatch and Complete it
  await request(`${BASE_URL}/trips/${tripId}/dispatch`, { method: 'PATCH', headers: headersManager });
  await request(`${BASE_URL}/trips/${tripId}/complete`, {
    method: 'PATCH',
    headers: headersManager,
    body: JSON.stringify({
      finalOdometer: 12240,
      fuelConsumed: 60,
      actualDistance: 240,
      completionNotes: 'Delivered',
      fuelCost: 180,
      tollCost: 35,
      otherExpenses: 15
    })
  });

  // 4. Completed Maintenance
  const maintRes = await request(`${BASE_URL}/maintenance`, {
    method: 'POST',
    headers: headersManager,
    body: JSON.stringify({
      vehicle: vehicleId,
      maintenanceType: 'Routine Oil Change',
      category: 'Engine',
      priority: 'Medium',
      scheduledDate: '2026-08-01T10:00:00Z',
      estimatedCost: 150
    })
  });
  const maintId = maintRes.body.data._id;
  await request(`${BASE_URL}/maintenance/${maintId}/start`, { method: 'PATCH', headers: headersManager });
  await request(`${BASE_URL}/maintenance/${maintId}/complete`, {
    method: 'PATCH',
    headers: headersManager,
    body: JSON.stringify({ labourCost: 80, partsCost: 120 })
  });

  // 5. Fuel Log
  await request(`${BASE_URL}/fuel`, {
    method: 'POST',
    headers: headersManager,
    body: JSON.stringify({
      vehicle: vehicleId,
      driver: driverId,
      fuelType: 'Diesel',
      fuelStation: 'Chevron #405',
      quantity: 120,
      pricePerUnit: 3.50,
      currentOdometer: 12200
    })
  });

  // 6. Expense
  await request(`${BASE_URL}/expenses`, {
    method: 'POST',
    headers: headersManager,
    body: JSON.stringify({
      vehicle: vehicleId,
      expenseType: 'Toll',
      vendor: 'EZ-Pass',
      amount: 45.00
    })
  });

  console.log('✓ System data seeded.');

  // ==================== DASHBOARD TESTS ====================
  console.log('\n==================== DASHBOARD MODULE TESTS ====================');
  const dashRes = await request(`${BASE_URL}/dashboard/summary`, { headers: headersDispatcher });
  assert.strictEqual(dashRes.status, 200);
  const summary = dashRes.body.data;
  assert.strictEqual(summary.totalVehicles, 1);
  assert.strictEqual(summary.totalTrips, 1);
  assert.strictEqual(summary.vehiclesOnTrip, 0); // Released on complete
  assert.strictEqual(summary.totalOperationalCost, 665); // fuelCost 420 + maintCost 200 + Toll 45 = 665
  console.log('✓ Dashboard: Summary statistics dynamically calculated correctly.');

  const chartsRes = await request(`${BASE_URL}/dashboard/charts`, { headers: headersDispatcher });
  assert.strictEqual(chartsRes.status, 200);
  assert.ok(chartsRes.body.data.tripsPerMonth);
  console.log('✓ Dashboard: Chart series trends mapped successfully.');

  const recentRes = await request(`${BASE_URL}/dashboard/recent-trips`, { headers: headersDispatcher });
  assert.strictEqual(recentRes.status, 200);
  assert.ok(recentRes.body.data.latestTrips);
  console.log('✓ Dashboard: Recent operations feeds loaded.');

  // ==================== REPORTS TESTS ====================
  console.log('\n==================== REPORTS MODULE TESTS ====================');
  const fleetRep = await request(`${BASE_URL}/reports/fleet`, { headers: headersDispatcher });
  assert.strictEqual(fleetRep.status, 200);
  assert.strictEqual(fleetRep.body.data.vehicleDowntime >= 0, true);

  const profitRep = await request(`${BASE_URL}/reports/profitability`, { headers: headersDispatcher });
  assert.strictEqual(profitRep.status, 200);
  // Revenue: 240 distance * 3.0 + 18000 weight * 0.02 = 720 + 360 = 1080
  assert.strictEqual(profitRep.body.data.revenue, 1080);
  // Cost: fuelCost 420 + maintCost 200 + Toll 45 = 665
  assert.strictEqual(profitRep.body.data.fuelCost, 420);
  assert.strictEqual(profitRep.body.data.maintenanceCost, 200);
  assert.strictEqual(profitRep.body.data.otherExpenses, 45); // tollCost 45 (excluding fuel/maintenance)
  assert.strictEqual(profitRep.body.data.netProfit, 415); // 1080 - 665 = 415
  console.log('✓ Reports: Profitability calculations matched exact bookkeeping figures.');

  // ==================== ANALYTICS TESTS ====================
  console.log('\n==================== ANALYTICS MODULE TESTS ====================');
  const analyticsRes = await request(`${BASE_URL}/analytics/fleet`, { headers: headersDispatcher });
  assert.strictEqual(analyticsRes.status, 200);
  assert.strictEqual(analyticsRes.body.data.revenue, 1080);
  assert.strictEqual(analyticsRes.body.data.netMargin, 38.43); // (415 / 1080) * 100 = 38.4259% -> 38.43%
  console.log('✓ Analytics: Operating margins calculated correctly.');

  // ==================== NOTIFICATIONS TESTS ====================
  console.log('\n==================== NOTIFICATIONS MODULE TESTS ====================');
  const alertRes = await request(`${BASE_URL}/notifications`, { headers: headersDispatcher });
  assert.strictEqual(alertRes.status, 200);
  // Scans should register some notifications (Fuel Added, Expense Added, Maintenance Completed)
  assert.ok(alertRes.body.data.notifications);
  const notificationId = alertRes.body.data.notifications[0]?._id;
  
  if (notificationId) {
    const readRes = await request(`${BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: headersDispatcher
    });
    assert.strictEqual(readRes.status, 200);
    assert.strictEqual(readRes.body.data.isRead, true);
    console.log('✓ Notifications: Marker read update successfully.');
  }

  // ==================== SETTINGS TESTS ====================
  console.log('\n==================== SETTINGS MODULE TESTS ====================');
  const getSett = await request(`${BASE_URL}/settings`, { headers: headersDispatcher });
  assert.strictEqual(getSett.status, 200);
  assert.strictEqual(getSett.body.data.companyName, 'TransitOps Fleet Management');
  console.log('✓ Settings: Default settings auto-seeded.');

  const updateSett = await request(`${BASE_URL}/settings`, {
    method: 'PUT',
    headers: headersManager,
    body: JSON.stringify({ companyName: 'TransitOps Super Fleet' })
  });
  assert.strictEqual(updateSett.status, 200);
  assert.strictEqual(updateSett.body.data.companyName, 'TransitOps Super Fleet');
  console.log('✓ Settings: Setting overrides updated.');

  // ==================== CSV / PDF EXPORT TESTS ====================
  console.log('\n==================== CSV & PDF EXPORT TESTS ====================');
  const csvVeh = await request(`${BASE_URL}/export/csv/vehicles`, { headers: headersDispatcher });
  assert.strictEqual(csvVeh.status, 200);
  assert.strictEqual(csvVeh.headers.get('Content-Type').includes('text/csv'), true);
  assert.ok(csvVeh.text.includes('TX-8899-E2E'));
  console.log('✓ Exports: Vehicle CSV spreadsheets formatted and downloaded.');

  const pdfDash = await request(`${BASE_URL}/export/pdf/dashboard`, { headers: headersDispatcher });
  assert.strictEqual(pdfDash.status, 200);
  assert.strictEqual(pdfDash.headers.get('Content-Type'), 'application/pdf');
  console.log('✓ Exports: Dashboard PDF streams downloaded.');

  // ==================== HEALTH DETAILS TESTS ====================
  console.log('\n==================== HEALTH DETAIL TESTS ====================');
  const healthDetail = await request(`${BASE_URL}/health`);
  assert.strictEqual(healthDetail.status, 200);
  assert.strictEqual(healthDetail.body.data.mongodbConnection, 'Connected');
  assert.strictEqual(healthDetail.body.data.apiStatus, 'Healthy');
  console.log('✓ Health Check: MongoDB state and Server environments checked.');

  console.log('\nALL PLATFORM INTEGRATION TESTS PASSED 100% E2E! SYSTEM IS FULLY INTEGRATED!');
}

runTests()
  .then(() => {
    if (server) server.close();
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('Test Suite Failed:', err);
    if (server) server.close();
    mongoose.connection.close();
    process.exit(1);
  });
