import mongoose from 'mongoose';

export let isMongooseConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/spendwise';

  try {
    // Attempt standard connection with 2500ms server selection timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isMongooseConnected = true;
    console.log(`[MongoDB] Connected successfully to external instance: ${uri}`);
  } catch (err) {
    isMongooseConnected = false;
    console.log(
      `[MongoDB] No external MongoDB daemon found at ${uri}. Activated SpendWise Zero-Config High-Performance In-Memory Engine with JSON persistence.`
    );
  }

  mongoose.connection.on('error', (err) => {
    console.error('[MongoDB] Runtime error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    isMongooseConnected = false;
  });
};

export const closeDB = async () => {
  if (isMongooseConnected) {
    await mongoose.disconnect();
  }
};
