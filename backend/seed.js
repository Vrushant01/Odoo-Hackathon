const mongoose = require('mongoose');
const User = require('./src/models/User');
const Vehicle = require('./src/models/Vehicle');
const Driver = require('./src/models/Driver');
const Trip = require('./src/models/Trip');
const Maintenance = require('./src/models/Maintenance');
const FuelLog = require('./src/models/FuelLog');
const Expense = require('./src/models/Expense');
const Settings = require('./src/models/Settings');

const MONGODB_URI = 'mongodb://localhost:27017/transitops';

async function seed() {
  console.log('--- Connecting to Development Database ---');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB.');

  // Clear existing collections
  console.log('Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Vehicle.deleteMany({}),
    Driver.deleteMany({}),
    Trip.deleteMany({}),
    Maintenance.deleteMany({}),
    FuelLog.deleteMany({}),
    Expense.deleteMany({}),
    Settings.deleteMany({})
  ]);
  console.log('Collections cleared.');

  // 1. Seed Users
  console.log('Seeding users...');
  const manager = new User({
    fullName: 'David FleetManager',
    email: 'manager@transitops.com',
    password: 'password123',
    role: 'Fleet Manager',
    phoneNumber: '+15550111',
    status: 'Active'
  });
  await manager.save();

  const dispatcher = new User({
    fullName: 'Sarah Dispatcher',
    email: 'dispatcher@transitops.com',
    password: 'password123',
    role: 'Dispatcher',
    phoneNumber: '+15550222',
    status: 'Active'
  });
  await dispatcher.save();
  console.log('✓ Seeded Users (manager@transitops.com / dispatcher@transitops.com)');

  // 2. Seed Vehicles
  console.log('Seeding vehicles...');
  const v1 = new Vehicle({
    registrationNumber: 'TX-9911-USA',
    vehicleName: 'Ford F-550 SuperDuty',
    vehicleModel: 'F-550',
    manufacturer: 'Ford',
    vehicleType: 'Truck',
    fuelType: 'Diesel',
    maximumLoadCapacity: 15000,
    currentOdometer: 45000,
    acquisitionCost: 85000,
    purchaseDate: new Date('2024-03-10'),
    region: 'North',
    status: 'Available',
    createdBy: manager._id
  });
  await v1.save();

  const v2 = new Vehicle({
    registrationNumber: 'CA-4422-TRK',
    vehicleName: 'Peterbilt 579 Semi',
    vehicleModel: '579',
    manufacturer: 'Peterbilt',
    vehicleType: 'Truck',
    fuelType: 'Diesel',
    maximumLoadCapacity: 35000,
    currentOdometer: 180000,
    acquisitionCost: 145000,
    purchaseDate: new Date('2023-08-15'),
    region: 'South',
    status: 'On Trip',
    createdBy: manager._id
  });
  await v2.save();

  const v3 = new Vehicle({
    registrationNumber: 'NY-8833-VAN',
    vehicleName: 'Mercedes Benz Sprinter',
    vehicleModel: 'Sprinter 2500',
    manufacturer: 'Mercedes Benz',
    vehicleType: 'Van',
    fuelType: 'Diesel',
    maximumLoadCapacity: 6000,
    currentOdometer: 62000,
    acquisitionCost: 52000,
    purchaseDate: new Date('2025-01-20'),
    region: 'East',
    status: 'In Shop',
    createdBy: manager._id
  });
  await v3.save();
  console.log('✓ Seeded Vehicles');

  // 3. Seed Drivers
  console.log('Seeding drivers...');
  const d1 = new Driver({
    fullName: 'Robert Miller',
    email: 'robert@transitops.com',
    phoneNumber: '+15551212',
    licenseNumber: 'CDL-R-8812',
    licenseCategory: 'Commercial',
    licenseExpiryDate: new Date('2029-12-31'),
    safetyScore: 98.2,
    status: 'Available',
    region: 'North',
    createdBy: manager._id
  });
  await d1.save();

  const d2 = new Driver({
    fullName: 'Michael Jones',
    email: 'michael@transitops.com',
    phoneNumber: '+15551313',
    licenseNumber: 'CDL-M-4423',
    licenseCategory: 'Commercial',
    licenseExpiryDate: new Date('2028-06-30'),
    safetyScore: 94.5,
    status: 'On Trip',
    region: 'South',
    createdBy: manager._id
  });
  await d2.save();

  const d3 = new Driver({
    fullName: 'William Brown',
    email: 'william@transitops.com',
    phoneNumber: '+15551414',
    licenseNumber: 'CDL-W-2211',
    licenseCategory: 'Commercial',
    licenseExpiryDate: new Date('2026-05-15'),
    safetyScore: 88.0,
    status: 'Suspended',
    region: 'East',
    createdBy: manager._id
  });
  await d3.save();
  console.log('✓ Seeded Drivers');

  // 4. Seed Trips
  console.log('Seeding trips...');
  // Completed Trip
  const t1 = new Trip({
    tripNumber: 'TRIP-2026-0001',
    vehicle: v1._id,
    driver: d1._id,
    source: 'Houston, TX',
    destination: 'Austin, TX',
    cargoDescription: 'Industrial Valves',
    cargoWeight: 8500,
    plannedDistance: 160,
    actualDistance: 160,
    status: 'Completed',
    dispatchDate: new Date('2026-07-01T08:00:00Z'),
    completedDate: new Date('2026-07-01T11:30:00Z'),
    fuelConsumed: 45,
    fuelCost: 155,
    tollCost: 12,
    otherExpenses: 8,
    totalOperationalCost: 175,
    createdBy: manager._id
  });
  await t1.save();

  // Active Dispatched Trip
  const t2 = new Trip({
    tripNumber: 'TRIP-2026-0002',
    vehicle: v2._id,
    driver: d2._id,
    source: 'Dallas, TX',
    destination: 'Chicago, IL',
    cargoDescription: 'Automotive Parts',
    cargoWeight: 22000,
    plannedDistance: 920,
    status: 'Dispatched',
    dispatchDate: new Date('2026-07-11T06:00:00Z'),
    createdBy: manager._id
  });
  await t2.save();
  console.log('✓ Seeded Trips');

  // 5. Seed Maintenance
  console.log('Seeding maintenance...');
  const m1 = new Maintenance({
    maintenanceNumber: 'MAIN-2026-0001',
    vehicle: v3._id,
    maintenanceType: 'Engine Overhaul',
    category: 'Engine',
    priority: 'Critical',
    status: 'In Progress',
    workshop: 'Metro Truck Service',
    mechanic: 'James Smith',
    description: 'Repairing piston rings and gasket replacement.',
    scheduledDate: new Date('2026-07-10T09:00:00Z'),
    startedDate: new Date('2026-07-10T10:00:00Z'),
    estimatedCost: 1500,
    createdBy: manager._id
  });
  await m1.save();
  console.log('✓ Seeded Maintenance');

  // 6. Seed Fuel Logs
  console.log('Seeding fuel logs...');
  const f1 = new FuelLog({
    fuelLogNumber: 'FUEL-2026-0001',
    vehicle: v1._id,
    driver: d1._id,
    trip: t1._id,
    fuelType: 'Diesel',
    fuelStation: 'Love\'s Travel Stop #334',
    quantity: 45,
    pricePerUnit: 3.44,
    totalCost: 154.8,
    currentOdometer: 45160,
    invoiceNumber: 'INV-F-99441',
    paymentMethod: 'Fuel Card',
    fuelDate: new Date('2026-07-01T08:15:00Z'),
    createdBy: manager._id
  });
  await f1.save();
  console.log('✓ Seeded Fuel Logs');

  // 7. Seed Expenses
  console.log('Seeding expenses...');
  const e1 = new Expense({
    expenseNumber: 'EXP-2026-0001',
    vehicle: v1._id,
    trip: t1._id,
    expenseType: 'Toll',
    vendor: 'TxTag Authority',
    amount: 12.00,
    paymentMethod: 'EZ-Pass',
    invoiceNumber: 'T-992211',
    paymentStatus: 'Paid',
    expenseDate: new Date('2026-07-01T09:30:00Z'),
    createdBy: manager._id
  });
  await e1.save();
  console.log('✓ Seeded Expenses');

  // 8. Seed Default Settings
  console.log('Seeding default settings...');
  const settings = new Settings({
    companyName: 'TransitOps Logistics Ltd',
    defaultRegion: 'North',
    defaultCurrency: 'USD',
    fuelUnit: 'Liters',
    distanceUnit: 'Kilometers',
    timezone: 'UTC',
    emailSettings: {
      host: 'smtp.mailtrap.io',
      port: 2525,
      secure: false,
      senderEmail: 'no-reply@transitops.com'
    }
  });
  await settings.save();
  console.log('✓ Seeded Settings');

  console.log('\n--- Database Seeding Completed Successfully ---');
}

seed()
  .then(() => {
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding Failed:', err);
    mongoose.connection.close();
    process.exit(1);
  });
