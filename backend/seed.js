// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const path = require('path');

// // Load environment variables
// dotenv.config({ path: path.join(__dirname, '.env') });

// const User = require('./src/models/User');
// const Vehicle = require('./src/models/Vehicle');
// const Driver = require('./src/models/Driver');
// const Trip = require('./src/models/Trip');
// const Maintenance = require('./src/models/Maintenance');
// const FuelLog = require('./src/models/FuelLog');
// const Expense = require('./src/models/Expense');
// const Settings = require('./src/models/Settings');

// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/transitops';
// const dns = require('dns');

// async function seed() {
//   console.log('--- Connecting to Development Database ---');
//   if (MONGODB_URI.startsWith('mongodb+srv://')) {
//     try {
//       dns.setServers(['1.1.1.1', '8.8.8.8']);
//     } catch (err) {
//       console.warn('Failed to set public DNS servers:', err.message);
//     }
//   }
//   await mongoose.connect(MONGODB_URI);
//   console.log('Connected to MongoDB.');

//   // Clear existing collections
//   console.log('Clearing existing collections...');
//   await Promise.all([
//     User.deleteMany({}),
//     Vehicle.deleteMany({}),
//     Driver.deleteMany({}),
//     Trip.deleteMany({}),
//     Maintenance.deleteMany({}),
//     FuelLog.deleteMany({}),
//     Expense.deleteMany({}),
//     Settings.deleteMany({})
//   ]);
//   console.log('Collections cleared.');

//   // 1. Seed Users
//   console.log('Seeding users...');
//   const users = [
//     {
//       fullName: 'David FleetManager',
//       email: 'manager@transitops.com',
//       password: 'password',
//       role: 'Fleet Manager',
//       phoneNumber: '+15550111',
//       status: 'Active'
//     },
//     {
//       fullName: 'Sarah Dispatcher',
//       email: 'dispatcher@transitops.com',
//       password: 'password',
//       role: 'Dispatcher',
//       phoneNumber: '+15550222',
//       status: 'Active'
//     },
//     {
//       fullName: 'John SafetyOfficer',
//       email: 'safety@transitops.com',
//       password: 'password',
//       role: 'Safety Officer',
//       phoneNumber: '+15550333',
//       status: 'Active'
//     },
//     {
//       fullName: 'Alex FinancialAnalyst',
//       email: 'finance@transitops.com',
//       password: 'password',
//       role: 'Financial Analyst',
//       phoneNumber: '+15550444',
//       status: 'Active'
//     }
//   ];

//   const seededUsers = [];
//   for (const u of users) {
//     const user = new User(u);
//     await user.save();
//     seededUsers.push(user);
//   }
//   console.log('✓ Seeded Users (manager, dispatcher, safety, finance with password: password)');

//   const manager = seededUsers[0];

//   // 2. Seed Vehicles
//   console.log('Seeding vehicles...');
//   const v1 = new Vehicle({
//     registrationNumber: 'TX-9911-USA',
//     vehicleName: 'Ford F-550 SuperDuty',
//     vehicleModel: 'F-550',
//     manufacturer: 'Ford',
//     vehicleType: 'Truck',
//     fuelType: 'Diesel',
//     maximumLoadCapacity: 15000,
//     currentOdometer: 45000,
//     acquisitionCost: 85000,
//     purchaseDate: new Date('2024-03-10'),
//     region: 'North',
//     status: 'Available',
//     createdBy: manager._id
//   });
//   await v1.save();

//   const v2 = new Vehicle({
//     registrationNumber: 'CA-4422-TRK',
//     vehicleName: 'Peterbilt 579 Semi',
//     vehicleModel: '579',
//     manufacturer: 'Peterbilt',
//     vehicleType: 'Truck',
//     fuelType: 'Diesel',
//     maximumLoadCapacity: 35000,
//     currentOdometer: 180000,
//     acquisitionCost: 145000,
//     purchaseDate: new Date('2023-08-15'),
//     region: 'South',
//     status: 'On Trip',
//     createdBy: manager._id
//   });
//   await v2.save();

//   const v3 = new Vehicle({
//     registrationNumber: 'NY-8833-VAN',
//     vehicleName: 'Mercedes Benz Sprinter',
//     vehicleModel: 'Sprinter 2500',
//     manufacturer: 'Mercedes Benz',
//     vehicleType: 'Van',
//     fuelType: 'Diesel',
//     maximumLoadCapacity: 6000,
//     currentOdometer: 62000,
//     acquisitionCost: 52000,
//     purchaseDate: new Date('2024-06-20'),
//     region: 'East',
//     status: 'In Shop',
//     createdBy: manager._id
//   });
//   await v3.save();
//   console.log('✓ Seeded Vehicles');

//   // 3. Seed Drivers
//   console.log('Seeding drivers...');
//   const d1 = new Driver({
//     fullName: 'David Miller',
//     email: 'david.miller@transitops.com',
//     phoneNumber: '+15551122',
//     licenseNumber: 'DL-CA63524',
//     licenseCategory: 'Commercial',
//     licenseExpiryDate: new Date('2026-07-28'),
//     dateOfBirth: new Date('1985-04-12'),
//     joiningDate: new Date('2020-01-15'),
//     experience: 8,
//     status: 'Available',
//     assignedVehicle: v1._id,
//     safetyScore: 92,
//     createdBy: manager._id
//   });
//   await d1.save();

//   const d2 = new Driver({
//     fullName: 'Marcus Vance',
//     email: 'marcus.vance@transitops.com',
//     phoneNumber: '+15553344',
//     licenseNumber: 'DL-TX48271',
//     licenseCategory: 'Commercial',
//     licenseExpiryDate: new Date('2026-08-15'),
//     dateOfBirth: new Date('1990-09-22'),
//     joiningDate: new Date('2021-06-10'),
//     experience: 5,
//     status: 'On Trip',
//     assignedVehicle: v2._id,
//     safetyScore: 88,
//     createdBy: manager._id
//   });
//   await d2.save();
//   console.log('✓ Seeded Drivers');

//   // 4. Seed Trips
//   console.log('Seeding trips...');
//   const t1 = new Trip({
//     tripNumber: 'TRIP-20260712-0001',
//     vehicle: v2._id,
//     driver: d2._id,
//     source: 'Houston, TX',
//     destination: 'Dallas, TX',
//     cargoDescription: 'Heavy Steel Structural Coils',
//     cargoWeight: 42000,
//     plannedDistance: 240,
//     actualDistance: 0,
//     status: 'Dispatched',
//     priority: 'High',
//     dispatchDate: new Date('2026-07-12T08:00:00Z'),
//     createdBy: manager._id
//   });
//   await t1.save();

//   const t2 = new Trip({
//     tripNumber: 'TRIP-20260711-0002',
//     vehicle: v1._id,
//     driver: d1._id,
//     source: 'Miami, FL',
//     destination: 'Orlando, FL',
//     cargoDescription: 'Medical Diagnostics Vaccines',
//     cargoWeight: 1200,
//     plannedDistance: 235,
//     actualDistance: 238,
//     actualDuration: 4.2,
//     fuelConsumed: 25,
//     fuelCost: 110,
//     tollCost: 15,
//     otherExpenses: 20,
//     status: 'Completed',
//     priority: 'High',
//     dispatchDate: new Date('2026-07-11T09:00:00Z'),
//     completedDate: new Date('2026-07-11T13:12:00Z'),
//     createdBy: manager._id
//   });
//   await t2.save();
//   console.log('✓ Seeded Trips');

//   // 5. Seed Maintenance
//   console.log('Seeding maintenance records...');
//   const m1 = new Maintenance({
//     maintenanceNumber: 'WO-20260712-0001',
//     vehicle: v3._id,
//     maintenanceType: 'Routine Service',
//     category: 'Preventative',
//     priority: 'Medium',
//     scheduledDate: new Date('2026-07-12'),
//     startedDate: new Date('2026-07-12'),
//     mechanic: 'Jack Mechanic',
//     workshop: 'East Fleet Depot Shop',
//     description: '100k miles engine checkup and spark plug replacement.',
//     status: 'In Progress',
//     estimatedCost: 450,
//     createdBy: manager._id
//   });
//   await m1.save();
//   console.log('✓ Seeded Maintenance');

//   // 6. Seed Fuel Logs
//   console.log('Seeding fuel logs...');
//   const f1 = new FuelLog({
//     fuelLogNumber: 'FUEL-20260710-0001',
//     vehicle: v1._id,
//     driver: d1._id,
//     fuelType: 'Diesel',
//     quantity: 50,
//     pricePerUnit: 3.5,
//     totalCost: 175,
//     currentOdometer: 45200,
//     fuelStation: 'Shell Highway 95',
//     invoiceNumber: 'INV-F-887712',
//     paymentMethod: 'Fuel Card',
//     fuelDate: new Date('2026-07-10'),
//     createdBy: manager._id
//   });
//   await f1.save();
//   console.log('✓ Seeded Fuel Logs');

//   // 7. Seed Expenses
//   console.log('Seeding expenses...');
//   const e1 = new Expense({
//     expenseNumber: 'EXP-20260711-0001',
//     vehicle: v1._id,
//     trip: t2._id,
//     expenseType: 'Toll',
//     amount: 15,
//     paymentMethod: 'Corporate Card',
//     invoiceNumber: 'INV-T-38190',
//     paymentStatus: 'Paid',
//     expenseDate: new Date('2026-07-11'),
//     createdBy: manager._id
//   });
//   await e1.save();
//   console.log('✓ Seeded Expenses');

//   // 8. Seed Settings
//   console.log('Seeding system settings...');
//   const settings = new Settings({
//     systemName: 'TransitOps Platform',
//     maintenanceAlertOdometerInterval: 5000,
//     fuelAlertThresholdMpg: 6.0,
//     regionSelectorList: ['North', 'South', 'East', 'West'],
//     companyAddress: '100 Transit Way, Logistics City, TX 77001',
//     supportContactEmail: 'support@transitops.com',
//     createdBy: manager._id
//   });
//   await settings.save();
//   console.log('✓ Seeded Settings');

//   console.log('\nDatabase seeding finished successfully!');
//   await mongoose.disconnect();
// }

// seed().catch((err) => {
//   console.error('Error seeding database:', err);
//   process.exit(1);
// });


const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

try {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
} catch (err) {
  console.warn('Failed to set public DNS servers:', err.message);
}

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./src/models/User');
const Vehicle = require('./src/models/Vehicle');
const Driver = require('./src/models/Driver');
const Trip = require('./src/models/Trip');
const Maintenance = require('./src/models/Maintenance');
const FuelLog = require('./src/models/FuelLog');
const Expense = require('./src/models/Expense');
const Settings = require('./src/models/Settings');
const AuditLog = require('./src/models/AuditLog');
const Notification = require('./src/models/Notification');
const VehicleTimeline = require('./src/models/VehicleTimeline');
const DriverTimeline = require('./src/models/DriverTimeline');
const TripTimeline = require('./src/models/TripTimeline');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/transitops';

// How many records to generate per collection (bump this to scale the whole seed up/down)
const RECORD_COUNT = 50;

// Utility helper for random selection
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const round = (val, dec) => Number(Math.round(val + 'e' + dec) + 'e-' + dec);
// Zero-pads day/month numbers so template-literal ISO date strings stay valid
// (e.g. "2026-07-1T..." is NOT valid ISO-8601 and parses to Invalid Date;
// "2026-07-01T..." is). Always use this when interpolating a day-of-month.
const pad2 = (n) => String(n).padStart(2, '0');

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
    Settings.deleteMany({}),
    AuditLog.deleteMany({}),
    Notification.deleteMany({}),
    VehicleTimeline.deleteMany({}),
    DriverTimeline.deleteMany({}),
    TripTimeline.deleteMany({})
  ]);
  console.log('Collections cleared.');

  // 1. Seed Core Users
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

  const safetyOfficer = new User({
    fullName: 'Nina SafetyOfficer',
    email: 'safety@transitops.com',
    password: 'password123',
    role: 'Safety Officer',
    phoneNumber: '+15550333',
    status: 'Active'
  });
  await safetyOfficer.save();

  const financialAnalyst = new User({
    fullName: 'Omar FinancialAnalyst',
    email: 'finance@transitops.com',
    password: 'password123',
    role: 'Financial Analyst',
    phoneNumber: '+15550444',
    status: 'Active'
  });
  await financialAnalyst.save();

  const usersList = [manager, dispatcher, safetyOfficer, financialAnalyst];
  console.log('✓ Users Seeded.');

  // 2. Seed Vehicles
  console.log(`Generating ${RECORD_COUNT} vehicles...`);
  const vehiclesList = [];
  const manufacturers = ['Volvo', 'Peterbilt', 'Ford', 'Mercedes Benz', 'Freightliner', 'Kenworth', 'International', 'Mack', 'Scania', 'MAN', 'Isuzu', 'Hino'];
  // NOTE: kept to the exact enum your Vehicle schema accepts (Truck, Van, Sedan, SUV, Trailer).
  // Adding 'Pickup'/'Box Truck'/'Flatbed' fails validation since they aren't in the schema's enum.
  const vehicleTypes = ['Truck', 'Van', 'Sedan', 'SUV', 'Trailer'];
  const fuelTypes = ['Diesel', 'Petrol', 'Electric', 'CNG', 'Hybrid'];
  // NOTE: reverted to the original 4 regions — unsure if 'Central' is in your Region enum,
  // so leaving this as-is to avoid the same class of validation error.
  const regions = ['North', 'South', 'East', 'West'];
  const vehicleStatuses = ['Available', 'On Trip', 'In Shop', 'Retired'];

  for (let i = 1; i <= RECORD_COUNT; i++) {
    const regNo = `TX-${1000 + i}-USA`;
    const type = getRandomItem(vehicleTypes);
    const brand = getRandomItem(manufacturers);
    const model = `${brand} Series-${getRandomRange(100, 900)}`;
    const cost = getRandomRange(35000, 150000);
    const capacity = type === 'Truck' || type === 'Trailer' ? getRandomRange(15000, 40000) : getRandomRange(2000, 8000);

    const vehicle = new Vehicle({
      registrationNumber: regNo,
      vehicleName: `${brand} ${type} #${i}`,
      vehicleModel: model,
      manufacturer: brand,
      vehicleType: type,
      fuelType: getRandomItem(fuelTypes),
      maximumLoadCapacity: capacity,
      currentOdometer: getRandomRange(10000, 250000),
      acquisitionCost: cost,
      purchaseDate: new Date(`202${getRandomRange(1, 5)}-0${getRandomRange(1, 9)}-15`),
      region: getRandomItem(regions),
      status: getRandomItem(vehicleStatuses),
      createdBy: manager._id
    });
    await vehicle.save();
    vehiclesList.push(vehicle);
  }
  console.log(`✓ ${RECORD_COUNT} Vehicles Seeded.`);

  // 3. Seed Drivers
  console.log(`Generating ${RECORD_COUNT} drivers...`);
  const driversList = [];
  // Combined combinatorially (firstNames x lastNames) so we always get unique,
  // realistic names even when RECORD_COUNT grows well past either list's length.
  const firstNames = [
    'Robert', 'Michael', 'William', 'David', 'James', 'John', 'Charles', 'Thomas', 'Daniel', 'Matthew',
    'Christopher', 'Joseph', 'Mark', 'Donald', 'Paul', 'Steven', 'Andrew', 'Kenneth', 'Joshua', 'Kevin',
    'Brian', 'George', 'Edward', 'Ronald', 'Timothy', 'Jason', 'Jeffrey', 'Ryan', 'Gary', 'Nicholas',
    'Eric', 'Stephen', 'Jacob', 'Larry', 'Jonathan', 'Scott', 'Frank', 'Justin', 'Brandon', 'Raymond',
    'Gregory', 'Samuel', 'Benjamin', 'Patrick', 'Jack', 'Alexander', 'Dennis', 'Jerry', 'Tyler', 'Aaron',
    'Maria', 'Linda', 'Susan', 'Karen', 'Nancy', 'Lisa', 'Sandra', 'Ashley', 'Michelle', 'Amanda'
  ];
  const lastNames = [
    'Miller', 'Jones', 'Brown', 'Davis', 'Wilson', 'Taylor', 'Anderson', 'Thomas', 'Moore', 'Martin',
    'Jackson', 'Thompson', 'White', 'Lopez', 'Lee', 'Gonzalez', 'Harris', 'Clark', 'Lewis', 'Robinson',
    'Walker', 'Perez', 'Hall', 'Young', 'Allen', 'Sanchez', 'Wright', 'King', 'Scott', 'Green',
    'Baker', 'Adams', 'Nelson', 'Hill', 'Ramirez', 'Campbell', 'Mitchell', 'Roberts', 'Carter', 'Phillips',
    'Evans', 'Turner', 'Torres', 'Parker', 'Collins', 'Edwards', 'Stewart', 'Morris', 'Nguyen', 'Murphy'
  ];
  const driverStatuses = ['Available', 'On Trip', 'Off Duty', 'Suspended', 'License Expired'];
  const licenseCategories = ['LMV', 'HMV', 'Transport', 'Commercial', 'Heavy Vehicle', 'Custom'];
  // Shared city/state list — reused for both driver addresses and trip source/destination.
  const usCities = [
    { city: 'Houston', state: 'TX' }, { city: 'Dallas', state: 'TX' }, { city: 'Chicago', state: 'IL' },
    { city: 'Austin', state: 'TX' }, { city: 'New York', state: 'NY' }, { city: 'Miami', state: 'FL' },
    { city: 'Los Angeles', state: 'CA' }, { city: 'Phoenix', state: 'AZ' }, { city: 'Denver', state: 'CO' },
    { city: 'Seattle', state: 'WA' }, { city: 'San Antonio', state: 'TX' }, { city: 'Atlanta', state: 'GA' },
    { city: 'Boston', state: 'MA' }, { city: 'Detroit', state: 'MI' }, { city: 'Portland', state: 'OR' },
    { city: 'Las Vegas', state: 'NV' }, { city: 'Nashville', state: 'TN' }, { city: 'Charlotte', state: 'NC' },
    { city: 'Indianapolis', state: 'IN' }, { city: 'Columbus', state: 'OH' }, { city: 'Kansas City', state: 'MO' },
    { city: 'Memphis', state: 'TN' }, { city: 'El Paso', state: 'TX' }, { city: 'Oklahoma City', state: 'OK' }
  ];

  for (let i = 1; i <= RECORD_COUNT; i++) {
    const first = firstNames[(i - 1) % firstNames.length];
    const last = lastNames[Math.floor((i - 1) / firstNames.length) % lastNames.length];
    const name = `${first} ${last}`;
    const email = `${name.toLowerCase().replace(/ /g, '')}${i}@transitops.com`;
    // FIX: previously `getRandomRange(75, 100) + Math.random()` could exceed 100
    // (e.g. 100 + 0.6 = 100.6), tripping the schema's max:100 validator.
    // Generating the whole decimal value in one shot keeps it within [75, 100].
    const score = round(75 + Math.random() * 25, 1);
    const home = getRandomItem(usCities);

    const driver = new Driver({
      fullName: name,
      email,
      phoneNumber: `+1555${(1000 + i)}`,
      licenseNumber: `CDL-D-${1000 + i}`,
      licenseCategory: getRandomItem(licenseCategories),
      licenseExpiryDate: new Date(`202${getRandomRange(7, 9)}-12-31`),
      safetyScore: score,
      status: getRandomItem(driverStatuses),
      city: home.city,
      state: home.state,
      country: 'USA',
      experience: getRandomRange(1, 25),
      joiningDate: new Date(`202${getRandomRange(1, 5)}-0${getRandomRange(1, 9)}-01`),
      bloodGroup: getRandomItem(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
      createdBy: manager._id
    });
    await driver.save();
    driversList.push(driver);
  }
  console.log(`✓ ${RECORD_COUNT} Drivers Seeded.`);

  // 4. Seed Trips
  console.log(`Generating ${RECORD_COUNT} trips...`);
  const tripsList = [];
  const cities = usCities.map(c => `${c.city}, ${c.state}`);
  const cargoTypes = [
    'Industrial Valves', 'Automotive Parts', 'Electronics', 'Perishable Food', 'Medical Supplies',
    'Dry Goods', 'Construction Materials', 'Furniture', 'Textiles', 'Chemicals', 'Machinery Parts', 'Packaged Beverages'
  ];
  const tripStatuses = ['Draft', 'Dispatched', 'Completed', 'Cancelled'];

  for (let i = 1; i <= RECORD_COUNT; i++) {
    const src = getRandomItem(cities);
    let dest = getRandomItem(cities);
    while (dest === src) {
      dest = getRandomItem(cities);
    }

    const vehicle = getRandomItem(vehiclesList);
    const driver = getRandomItem(driversList);
    const status = getRandomItem(tripStatuses);

    const weight = getRandomRange(1000, 15000);
    const distance = getRandomRange(150, 1200);

    const tripPayload = {
      tripNumber: `TRIP-2026-${i.toString().padStart(4, '0')}`,
      vehicle: vehicle._id,
      driver: driver._id,
      source: src,
      destination: dest,
      cargoDescription: getRandomItem(cargoTypes),
      cargoWeight: weight,
      plannedDistance: distance,
      priority: getRandomItem(['Low', 'Medium', 'High', 'Critical']),
      status,
      dispatchDate: new Date(`2026-07-${pad2(getRandomRange(1, 15))}T08:00:00Z`),
      createdBy: manager._id
    };

    if (status === 'Completed') {
      const fuelCons = round(distance / getRandomRange(4, 8), 1);
      const fuelVal = round(fuelCons * 3.5, 2);
      const tollVal = getRandomRange(5, 50);
      const otherVal = getRandomRange(5, 25);

      tripPayload.actualDistance = distance;
      tripPayload.completedDate = new Date(`2026-07-${pad2(getRandomRange(16, 20))}T16:00:00Z`);
      tripPayload.fuelConsumed = fuelCons;
      tripPayload.fuelCost = fuelVal;
      tripPayload.tollCost = tollVal;
      tripPayload.otherExpenses = otherVal;
      tripPayload.totalOperationalCost = round(fuelVal + tollVal + otherVal, 2);
    } else if (status === 'Cancelled') {
      tripPayload.cancellationReason = 'Driver unavailable or vehicle malfunction';
    }

    const trip = new Trip(tripPayload);
    await trip.save();
    tripsList.push(trip);
  }
  console.log(`✓ ${RECORD_COUNT} Trips Seeded.`);

  // 5. Seed Maintenance Logs
  console.log(`Generating ${RECORD_COUNT} maintenance logs...`);
  const maintenanceCategories = ['Engine', 'Brakes', 'Tyres', 'Electrical', 'Transmission', 'Suspension', 'Cooling System', 'Exhaust'];
  const maintenanceTypes = [
    'Routine Oil Change', 'Brake Pad Swapping', 'Wheel Alignment', 'Alternator Replacement', 'Gearbox Tuning',
    'Coolant Flush', 'Battery Replacement', 'Tyre Rotation', 'Air Filter Replacement', 'Suspension Repair'
  ];
  const maintenancePriorities = ['Low', 'Medium', 'High', 'Critical'];
  const maintenanceStatuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
  const mechanics = ['James Smith', 'Alan Turing', 'Albert Ross', 'Donald Knuth', 'Grace Hopper', 'Ada Lovelace', 'Linus Torvalds'];

  for (let i = 1; i <= RECORD_COUNT; i++) {
    const vehicle = getRandomItem(vehiclesList);
    const status = getRandomItem(maintenanceStatuses);

    const labour = getRandomRange(50, 400);
    const parts = getRandomRange(20, 800);
    const additional = getRandomRange(10, 100);

    const m = new Maintenance({
      maintenanceNumber: `MAIN-2026-${i.toString().padStart(4, '0')}`,
      vehicle: vehicle._id,
      maintenanceType: getRandomItem(maintenanceTypes),
      category: getRandomItem(maintenanceCategories),
      priority: getRandomItem(maintenancePriorities),
      status,
      workshop: 'TransitOps Maintenance Workshop',
      mechanic: getRandomItem(mechanics),
      description: 'Scheduled multi-point inspection and minor repairs.',
      scheduledDate: new Date(`2026-07-${pad2(getRandomRange(1, 15))}T09:00:00Z`),
      createdBy: manager._id
    });

    if (status === 'Completed') {
      m.startedDate = new Date(`2026-07-${pad2(getRandomRange(16, 20))}T09:00:00Z`);
      m.completedDate = new Date(`2026-07-${pad2(getRandomRange(21, 25))}T17:00:00Z`);
      m.labourCost = labour;
      m.partsCost = parts;
      m.additionalCost = additional;
      m.finalCost = labour + parts + additional;
      m.partsUsed = ['Engine Oil Filters', 'Brake Shoe Pads'];
      m.serviceNotes = 'Vehicle returned back to active fleet service.';
    } else if (status === 'In Progress') {
      m.startedDate = new Date();
    }

    await m.save();
  }
  console.log(`✓ ${RECORD_COUNT} Maintenance Logs Seeded.`);

  // 6. Seed Fuel Logs
  console.log(`Generating ${RECORD_COUNT} fuel logs...`);
  const fuelStations = ['Chevron #902', 'Shell Station #11', 'Loves Travel Stop', 'Pilot Flying J', 'TA Travel Center', 'Circle K #45', 'Speedway #77'];
  for (let i = 1; i <= RECORD_COUNT; i++) {
    const vehicle = getRandomItem(vehiclesList);
    const driver = getRandomItem(driversList);
    const qty = getRandomRange(30, 200);
    const pPU = round(3.2 + Math.random(), 2);

    const f = new FuelLog({
      fuelLogNumber: `FUEL-2026-${i.toString().padStart(4, '0')}`,
      vehicle: vehicle._id,
      driver: driver._id,
      fuelType: getRandomItem(fuelTypes),
      fuelStation: getRandomItem(fuelStations),
      quantity: qty,
      pricePerUnit: pPU,
      totalCost: round(qty * pPU, 2),
      currentOdometer: vehicle.currentOdometer + getRandomRange(10, 100),
      invoiceNumber: `INV-F-${20000 + i}`,
      paymentMethod: getRandomItem(['Fuel Card', 'Credit Card', 'Cash']),
      fuelDate: new Date(`2026-07-${pad2(getRandomRange(1, 28))}T12:00:00Z`),
      createdBy: manager._id
    });
    await f.save();
  }
  console.log(`✓ ${RECORD_COUNT} Fuel Logs Seeded.`);

  // 7. Seed Expenses
  console.log(`Generating ${RECORD_COUNT} expenses...`);
  // Matches the exact Expense schema enum. 'Registration' was invalid and caused a validation error.
  const expenseTypes = ['Fuel', 'Maintenance', 'Repair', 'Insurance', 'Parking', 'Toll', 'Permit', 'Cleaning', 'Battery', 'Tyre', 'Fine', 'Other'];
  const vendors = ['TxTag Authority', 'City Parking Authority', 'State DMV', 'QuickWash Fleet Services', 'National Tyre Co', 'Allstate Commercial'];

  for (let i = 1; i <= RECORD_COUNT; i++) {
    const vehicle = getRandomItem(vehiclesList);

    const e = new Expense({
      expenseNumber: `EXP-2026-${i.toString().padStart(4, '0')}`,
      vehicle: vehicle._id,
      expenseType: getRandomItem(expenseTypes),
      vendor: getRandomItem(vendors),
      amount: getRandomRange(5, 200),
      paymentMethod: getRandomItem(['Credit Card', 'EZ-Pass', 'Cash']),
      invoiceNumber: `INV-E-${50000 + i}`,
      paymentStatus: getRandomItem(['Paid', 'Pending']),
      expenseDate: new Date(`2026-07-${pad2(getRandomRange(1, 28))}T14:00:00Z`),
      createdBy: manager._id
    });
    await e.save();
  }
  console.log(`✓ ${RECORD_COUNT} Expenses Seeded.`);

  // 8. Seed Audit Logs
  console.log(`Generating ${RECORD_COUNT} audit logs...`);
  const auditActions = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'STATUS_CHANGE'];
  const auditModules = ['Auth', 'Vehicles', 'Drivers', 'Trips', 'Maintenance', 'FuelLogs', 'Expenses', 'Settings'];

  for (let i = 1; i <= RECORD_COUNT; i++) {
    const action = getRandomItem(auditActions);
    const module = getRandomItem(auditModules);
    const log = new AuditLog({
      user: getRandomItem(usersList)._id,
      action,
      module,
      oldValue: action === 'UPDATE' || action === 'STATUS_CHANGE' ? { status: 'Available' } : undefined,
      newValue: action === 'UPDATE' || action === 'STATUS_CHANGE' ? { status: 'On Trip' } : undefined,
      ipAddress: `10.0.${getRandomRange(0, 255)}.${getRandomRange(1, 254)}`,
      device: getRandomItem(['Chrome / Windows', 'Safari / macOS', 'Chrome / Android', 'Firefox / Linux']),
      timestamp: new Date(`2026-07-${pad2(getRandomRange(1, 28))}T${pad2(getRandomRange(6, 22))}:${pad2(getRandomRange(0, 59))}:00Z`)
    });
    await log.save();
  }
  console.log(`✓ ${RECORD_COUNT} Audit Logs Seeded.`);

  // 9. Seed Notifications
  console.log(`Generating ${RECORD_COUNT} notifications...`);
  const notificationTypes = [
    'License Expiring', 'License Expired', 'Vehicle Maintenance Due', 'Maintenance Completed',
    'Trip Assigned', 'Trip Completed', 'Fuel Added', 'Expense Added', 'Vehicle Retired', 'Vehicle Returned'
  ];
  const notificationMessages = {
    'License Expiring': 'A driver license is due to expire within 30 days.',
    'License Expired': 'A driver license has expired and requires renewal.',
    'Vehicle Maintenance Due': 'A vehicle is due for scheduled maintenance.',
    'Maintenance Completed': 'A scheduled maintenance job has been completed.',
    'Trip Assigned': 'A new trip has been assigned to a driver.',
    'Trip Completed': 'A trip has been marked as completed.',
    'Fuel Added': 'A new fuel log has been recorded for a vehicle.',
    'Expense Added': 'A new expense has been logged against a vehicle.',
    'Vehicle Retired': 'A vehicle has been marked as retired from the fleet.',
    'Vehicle Returned': 'A vehicle has returned to the depot and is available.'
  };

  for (let i = 1; i <= RECORD_COUNT; i++) {
    const type = getRandomItem(notificationTypes);
    const n = new Notification({
      title: type,
      message: notificationMessages[type],
      type,
      isRead: Math.random() > 0.5,
      recipient: getRandomItem(usersList)._id,
      createdAt: new Date(`2026-07-${pad2(getRandomRange(1, 28))}T${pad2(getRandomRange(6, 22))}:00:00Z`)
    });
    await n.save();
  }
  console.log(`✓ ${RECORD_COUNT} Notifications Seeded.`);

  // 10. Seed Vehicle Timelines (2 events per vehicle)
  console.log('Generating vehicle timelines...');
  const vehicleEventTypes = [
    'Vehicle Registered', 'Vehicle Updated', 'Trip Assigned', 'Trip Completed',
    'Maintenance Scheduled', 'Maintenance Started', 'Maintenance Completed',
    'Fuel Added', 'Expense Added', 'Vehicle Returned', 'Vehicle Retired'
  ];
  let vehicleTimelineCount = 0;
  for (const vehicle of vehiclesList) {
    // Every vehicle gets a registration event, plus one more random lifecycle event.
    await new VehicleTimeline({
      vehicleId: vehicle._id,
      eventType: 'Vehicle Registered',
      description: `${vehicle.vehicleName} was registered into the fleet.`,
      metadata: { registrationNumber: vehicle.registrationNumber },
      createdBy: manager._id,
      createdAt: vehicle.purchaseDate
    }).save();

    const secondEvent = getRandomItem(vehicleEventTypes.filter(e => e !== 'Vehicle Registered'));
    await new VehicleTimeline({
      vehicleId: vehicle._id,
      eventType: secondEvent,
      description: `${secondEvent} event recorded for ${vehicle.vehicleName}.`,
      createdBy: manager._id,
      createdAt: new Date(`2026-07-${pad2(getRandomRange(1, 28))}T10:00:00Z`)
    }).save();
    vehicleTimelineCount += 2;
  }
  console.log(`✓ ${vehicleTimelineCount} Vehicle Timeline Events Seeded.`);

  // 11. Seed Driver Timelines (2 events per driver)
  console.log('Generating driver timelines...');
  const driverEventTypes = [
    'Driver Registered', 'License Updated', 'Vehicle Assigned', 'Trip Started',
    'Trip Completed', 'License Renewed', 'Suspended', 'Activated', 'Profile Updated'
  ];
  let driverTimelineCount = 0;
  for (const driver of driversList) {
    await new DriverTimeline({
      driverId: driver._id,
      eventType: 'Driver Registered',
      description: `${driver.fullName} was onboarded as a driver.`,
      metadata: { licenseNumber: driver.licenseNumber },
      createdBy: manager._id,
      createdAt: driver.joiningDate || new Date('2026-07-01T09:00:00Z')
    }).save();

    const secondEvent = getRandomItem(driverEventTypes.filter(e => e !== 'Driver Registered'));
    await new DriverTimeline({
      driverId: driver._id,
      eventType: secondEvent,
      description: `${secondEvent} event recorded for ${driver.fullName}.`,
      createdBy: manager._id,
      createdAt: new Date(`2026-07-${pad2(getRandomRange(1, 28))}T11:00:00Z`)
    }).save();
    driverTimelineCount += 2;
  }
  console.log(`✓ ${driverTimelineCount} Driver Timeline Events Seeded.`);

  // 12. Seed Trip Timelines (events reflecting each trip's actual status)
  console.log('Generating trip timelines...');
  let tripTimelineCount = 0;
  for (const trip of tripsList) {
    await new TripTimeline({
      tripId: trip._id,
      eventType: 'Trip Created',
      description: `Trip ${trip.tripNumber} was created.`,
      createdBy: manager._id,
      createdAt: trip.dispatchDate || new Date('2026-07-01T08:00:00Z')
    }).save();
    tripTimelineCount++;

    if (trip.status === 'Dispatched' || trip.status === 'Completed') {
      await new TripTimeline({
        tripId: trip._id,
        eventType: 'Trip Dispatched',
        description: `Trip ${trip.tripNumber} was dispatched.`,
        createdBy: manager._id,
        createdAt: trip.dispatchDate || new Date('2026-07-01T08:00:00Z')
      }).save();
      tripTimelineCount++;
    }

    if (trip.status === 'Completed') {
      await new TripTimeline({
        tripId: trip._id,
        eventType: 'Trip Completed',
        description: `Trip ${trip.tripNumber} was completed successfully.`,
        createdBy: manager._id,
        createdAt: trip.completedDate || new Date('2026-07-20T16:00:00Z')
      }).save();
      tripTimelineCount++;
    } else if (trip.status === 'Cancelled') {
      await new TripTimeline({
        tripId: trip._id,
        eventType: 'Trip Cancelled',
        description: `Trip ${trip.tripNumber} was cancelled: ${trip.cancellationReason || 'No reason provided'}.`,
        createdBy: manager._id,
        createdAt: trip.dispatchDate || new Date('2026-07-01T08:00:00Z')
      }).save();
      tripTimelineCount++;
    }
  }
  console.log(`✓ ${tripTimelineCount} Trip Timeline Events Seeded.`);

  // 13. Seed Default Settings
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
  console.log('✓ Settings Seeded.');

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