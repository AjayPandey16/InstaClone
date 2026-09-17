const mongoose = require('mongoose');

const connectDatabase = async (retries = 5) => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/instaClone';

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
    return mongoose.connection;
  } catch (error) {
    if (retries > 0) {
      console.warn(`MongoDB connection failed. Retrying in 2s... (${retries} tries left)`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return connectDatabase(retries - 1);
    }
    throw error;
  }
};

module.exports = connectDatabase;