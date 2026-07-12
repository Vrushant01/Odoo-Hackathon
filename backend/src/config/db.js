const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/transitops';
  
  if (connUri.startsWith('mongodb+srv://')) {
    try {
      dns.setServers(['1.1.1.1', '8.8.8.8']);
    } catch (err) {
      console.warn('Failed to set public DNS servers:', err.message);
    }
  }
  
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connection established successfully.');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB connection disconnected. Mongoose will attempt to reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB connection reconnected successfully.');
  });

  try {
    await mongoose.connect(connUri, {
      autoIndex: true,
    });
  } catch (error) {
    console.error(`Initial MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination.');
  } catch (error) {
    console.error(`Error closing MongoDB connection: ${error}`);
  }
};

// Process termination hooks for graceful shutdown
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDB();
  process.exit(0);
});

module.exports = { connectDB, closeDB };
