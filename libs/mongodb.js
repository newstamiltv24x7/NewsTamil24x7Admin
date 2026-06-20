import mongoose from "mongoose";

// const connectionURL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.zomdyai.mongodb.net/?retryWrites=true&w=majority`;
const connectionURL = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_IP}/${process.env.MONGO_DATABASE}?authSource=${process.env.MONGO_DATABASE}&readPreference=primary&directConnection=true&ssl=false`;

let cachedConnection = null;

const connectMongoDB = async () => {
  // Skip attempting a DB connection during Next.js production build
  if (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.SKIP_DB_DURING_BUILD === "true"
  ) {
    return;
  }

  // Reuse active Mongoose connection
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  // Reuse cached connection promise/result
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    mongoose.set("strictQuery", false);

    cachedConnection = await mongoose.connect(connectionURL, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 30000,
    });

    return cachedConnection;
  } catch (error) {
    cachedConnection = null;
    throw error;
  }
};

export default connectMongoDB;