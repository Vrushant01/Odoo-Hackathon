const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

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

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/transitops';

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
  const users = [
    {
      fullName: 'David FleetManager',
      email: 'manager@transitops.com',
      password: 'password',
      role: 'Fleet Manager',
      phoneNumber: '+15550111',
      status: 'Active'
    },
    {
      fullName: 'Sarah Dispatcher',
      email: 'dispatcher@transitops.com',
      password: 'password',
      role: 'Dispatcher',
      phoneNumber: '+15550222',
      status: 'Active'
    },
    {
      fullName: 'John SafetyOfficer',
      email: 'safety@transitops.com',
      password: 'password',
      role: 'Safety Officer',
      phoneNumber: '+15550333',
      status: 'Active'
    },
    {
      fullName: 'Alex FinancialAnalyst',
      email: 'finance@transitops.com',
      password: 'password',
      role: 'Financial Analyst',
      phoneNumber: '+15550444',
      status: 'Active'
    }
  ];

  const seededUsers = [];
  for (const u of users) {
    const user = new User(u);
    await user.save();
    seededUsers.push(user);
  }
  console.log('✓ Seeded Users (manager, dispatcher, safety, finance with password: password)');

  const manager = seededUsers[0];

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
    purchaseDate: new Date('2024-06-20'),
    region: 'East',
    status: 'In Shop',
    createdBy: manager._id
  });
  await v3.save();
  console.log('✓ Seeded Vehicles');

  // 3. Seed Drivers
  console.log('Seeding drivers...');
  const d1 = new Driver({
    fullName: 'David Miller',
    email: 'david.miller@transitops.com',
    phoneNumber: '+15551122',
    licenseNumber: 'DL-CA63524',
    licenseCategory: 'Commercial',
    licenseExpiryDate: new Date('2026-07-28'),
    dateOfBirth: new Date('1985-04-12'),
    joiningDate: new Date('2020-01-15'),
    experience: 8,
    status: 'Available',
    assignedVehicle: v1._id,
    safetyScore: 92,
    createdBy: manager._id
  });
  await d1.save();

  const d2 = new Driver({
    fullName: 'Marcus Vance',
    email: 'marcus.vance@transitops.com',
    phoneNumber: '+15553344',
    licenseNumber: 'DL-TX48271',
    licenseCategory: 'Commercial',
    licenseExpiryDate: new Date('2026-08-15'),
    dateOfBirth: new Date('1990-09-22'),
    joiningDate: new Date('2021-06-10'),
    experience: 5,
    status: 'On Trip',
    assignedVehicle: v2._id,
    safetyScore: 88,
    createdBy: manager._id
  });
  await d2.save();
  console.log('✓ Seeded Drivers');

  // 4. Seed Trips
  console.log('Seeding trips...');
  const t1 = new Trip({
    tripNumber: 'TRIP-20260712-0001',
    vehicle: v2._id,
    driver: d2._id,
    source: 'Houston, TX',
    destination: 'Dallas, TX',
    cargoDescription: 'Heavy Steel Structural Coils',
    cargoWeight: 42000,
    plannedDistance: 240,
    actualDistance: 0,
    status: 'Dispatched',
    priority: 'High',
    dispatchDate: new Date('2026-07-12T08:00:00Z'),
    createdBy: manager._id
  });
  await t1.save();

  const t2 = new Trip({
    tripNumber: 'TRIP-20260711-0002',
    vehicle: v1._id,
    driver: d1._id,
    source: 'Miami, FL',
    destination: 'Orlando, FL',
    cargoDescription: 'Medical Diagnostics Vaccines',
    cargoWeight: 1200,
    plannedDistance: 235,
    actualDistance: 238,
    actualDuration: 4.2,
    fuelConsumed: 25,
    fuelCost: 110,
    tollCost: 15,
    otherExpenses: 20,
    status: 'Completed',
    priority: 'High',
    dispatchDate: new Date('2026-07-11T09:00:00Z'),
    completedDate: new Date('2026-07-11T13:12:00Z'),
    createdBy: manager._id
  });
  await t2.save();
  console.log('✓ Seeded Trips');

  // 5. Seed Maintenance
  console.log('Seeding maintenance records...');
  const m1 = new Maintenance({
    maintenanceNumber: 'WO-20260712-0001',
    vehicle: v3._id,
    maintenanceType: 'Routine Service',
    category: 'Preventative',
    priority: 'Medium',
    scheduledDate: new Date('2026-07-12'),
    startedDate: new Date('2026-07-12'),
    mechanic: 'Jack Mechanic',
    workshop: 'East Fleet Depot Shop',
    description: '100k miles engine checkup and spark plug replacement.',
    status: 'In Progress',
    estimatedCost: 450,
    createdBy: manager._id
  });
  await m1.save();
  console.log('✓ Seeded Maintenance');

  // 6. Seed Fuel Logs
  console.log('Seeding fuel logs...');
  const f1 = new FuelLog({
    fuelLogNumber: 'FUEL-20260710-0001',
    vehicle: v1._id,
    driver: d1._id,
    fuelType: 'Diesel',
    quantity: 50,
    pricePerUnit: 3.5,
    totalCost: 175,
    currentOdometer: 45200,
    fuelStation: 'Shell Highway 95',
    invoiceNumber: 'INV-F-887712',
    paymentMethod: 'Fuel Card',
    fuelDate: new Date('2026-07-10'),
    createdBy: manager._id
  });
  await f1.save();
  console.log('✓ Seeded Fuel Logs');

  // 7. Seed Expenses
  console.log('Seeding expenses...');
  const e1 = new Expense({
    expenseNumber: 'EXP-20260711-0001',
    vehicle: v1._id,
    trip: t2._id,
    expenseType: 'Toll',
    amount: 15,
    paymentMethod: 'Corporate Card',
    invoiceNumber: 'INV-T-38190',
    paymentStatus: 'Paid',
    expenseDate: new Date('2026-07-11'),
    createdBy: manager._id
  });
  await e1.save();
  console.log('✓ Seeded Expenses');

  // 8. Seed Settings
  console.log('Seeding system settings...');
  const settings = new Settings({
    systemName: 'TransitOps Platform',
    maintenanceAlertOdometerInterval: 5000,
    fuelAlertThresholdMpg: 6.0,
    regionSelectorList: ['North', 'South', 'East', 'West'],
    companyAddress: '100 Transit Way, Logistics City, TX 77001',
    supportContactEmail: 'support@transitops.com',
    createdBy: manager._id
  });
  await settings.save();
  console.log('✓ Seeded Settings');

  console.log('\nDatabase seeding finished successfully!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
