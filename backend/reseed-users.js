/**
 * reseed-users.js
 * Re-seeds the 4 demo users with the correct password: "password"
 * Run with: node reseed-users.js
 */

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1', '208.67.222.222']);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/transitops';

const users = [
  {
    fullName: 'David SuperAdmin',
    email: 'admin@transitops.com',
    password: 'password',
    role: 'Super Admin',
    phoneNumber: '+15550000',
    status: 'Active',
    department: 'IT / Security'
  },
  {
    fullName: 'David FleetManager',
    email: 'manager@transitops.com',
    password: 'password',
    role: 'Fleet Manager',
    phoneNumber: '+15550111',
    status: 'Active',
    department: 'Operations'
  },
  {
    fullName: 'Sarah Dispatcher',
    email: 'dispatcher@transitops.com',
    password: 'password',
    role: 'Dispatcher',
    phoneNumber: '+15550222',
    status: 'Active',
    department: 'Logistics'
  },
  {
    fullName: 'John SafetyOfficer',
    email: 'safety@transitops.com',
    password: 'password',
    role: 'Safety Officer',
    phoneNumber: '+15550333',
    status: 'Active',
    department: 'Compliance'
  },
  {
    fullName: 'Alex FinancialAnalyst',
    email: 'finance@transitops.com',
    password: 'password',
    role: 'Financial Analyst',
    phoneNumber: '+15550444',
    status: 'Active',
    department: 'Finance'
  }
];

async function reseedUsers() {
  console.log('Connecting to:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  console.log('Connected to MongoDB.\n');

  const db = mongoose.connection.db;
  const collection = db.collection('users');

  for (const u of users) {
    // Hash the password fresh
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(u.password, salt);

    // Upsert the user (update if exists, insert if not)
    const result = await collection.updateOne(
      { email: u.email },
      {
        $set: {
          fullName: u.fullName,
          email: u.email,
          password: hashedPassword,
          role: u.role,
          phoneNumber: u.phoneNumber,
          status: u.status,
          department: u.department || 'Operations',
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    // Verify the hash works
    const verify = await bcrypt.compare(u.password, hashedPassword);
    console.log(`✓ ${u.email} | ${u.role} | hash-verify: ${verify ? 'OK' : 'FAIL'} | ${result.upsertedCount ? 'INSERTED' : 'UPDATED'}`);
  }

  console.log('\n✅ All 4 demo users reseeded with password: "password"');
  console.log('   You can now log in with any of these accounts.');
  await mongoose.connection.close();
}

reseedUsers().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
