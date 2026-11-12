import mongoose from 'mongoose';

export let isMongooseConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      console.log(
        '[MongoDB] No MONGODB_URI set. Activated SpendWise Zero-Config High-Performance In-Memory Engine.'
      );
      isMongooseConnected = false;
      return;
    }
  }

  const targetUri = uri || 'mongodb://127.0.0.1:27017/spendwise';

  try {
    // Attempt connection with 2500ms server selection timeout
    await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 2500,
    });
    isMongooseConnected = true;
    console.log(`[MongoDB] Connected successfully to external instance: ${targetUri.replace(/\/\/.*@/, '//***:***@')}`);
  } catch (err) {
    isMongooseConnected = false;
    console.log(
      `[MongoDB] No external MongoDB daemon found at ${targetUri.replace(/\/\/.*@/, '//***:***@')}. Activated SpendWise Zero-Config High-Performance In-Memory Engine with JSON persistence.`
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
