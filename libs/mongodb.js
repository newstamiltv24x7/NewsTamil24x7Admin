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
      maxPoolSize: 15,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 30000,
      maxIdleTimeMS: 60000,  // Close idle connections after 60 seconds
    });

    return cachedConnection;
  } catch (error) {
    cachedConnection = null;
    throw error;
  }
};

export default connectMongoDB;
// import mongoose from "mongoose";

// // const connectionURL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.zomdyai.mongodb.net/?retryWrites=true&w=majority`;
// const connectionURL = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_IP}/${process.env.MONGO_DATABASE}?authSource=${process.env.MONGO_DATABASE}&readPreference=primary&directConnection=true&ssl=false`;

// let cachedConnection = null;

// const connectMongoDB = async () => {
//   // Skip attempting a DB connection during Next.js production build
//   if (
//     process.env.NEXT_PHASE === "phase-production-build" ||
//     process.env.SKIP_DB_DURING_BUILD === "true"
//   ) {
//     return;
//   }

//   // Reuse active Mongoose connection
//   if (mongoose.connection.readyState >= 1) {
//     return mongoose.connection;
//   }

//   // Reuse cached connection promise/result
//   if (cachedConnection) {
//     return cachedConnection;
//   }

//   try {
//     mongoose.set("strictQuery", false);

//     cachedConnection = await mongoose.connect(connectionURL, {
//       maxPoolSize: 50,
//       minPoolSize: 10,
//       // Fail fast in dev when DB is unreachable so requests don't hang
//       serverSelectionTimeoutMS: 1000,
//       socketTimeoutMS: 60000,
//       heartbeatFrequencyMS: 30000,
//       retryWrites: true,
//       w: "majority",
//       maxIdleTimeMS: 45000,
//       waitQueueTimeoutMS: 10000,
//     });

//     console.log("✅ MongoDB connected successfully");
//     return cachedConnection;
//   } catch (error) {
//     cachedConnection = null;
//     console.error("❌ MongoDB connection error:", error.message);

//     // Install safe fallbacks to avoid long buffering timeouts across the app
//     // when MongoDB is unreachable. These return fast, empty results so the
//     // frontend can render gracefully instead of waiting for timeouts.
//     try {
//       // Only patch once
//       if (!global.__MONGO_FALLBACK_INSTALLED) {
//         const proto = mongoose.Model && mongoose.Model.prototype;
//         if (proto) {
//           if (!proto._orig_find) proto._orig_find = proto.find;
//           proto.find = function () {
//             if (mongoose.connection.readyState < 1) return Promise.resolve([]);
//             return proto._orig_find.apply(this, arguments);
//           };

//           if (!proto._orig_findOne) proto._orig_findOne = proto.findOne;
//           proto.findOne = function () {
//             if (mongoose.connection.readyState < 1) return Promise.resolve(null);
//             return proto._orig_findOne.apply(this, arguments);
//           };

//           if (!proto._orig_aggregate) proto._orig_aggregate = proto.aggregate;
//           proto.aggregate = function () {
//             if (mongoose.connection.readyState < 1) return Promise.resolve([]);
//             return proto._orig_aggregate.apply(this, arguments);
//           };

//           if (!proto._orig_countDocuments) proto._orig_countDocuments = proto.countDocuments;
//           proto.countDocuments = function () {
//             if (mongoose.connection.readyState < 1) return Promise.resolve(0);
//             return proto._orig_countDocuments.apply(this, arguments);
//           };
//         }
//         global.__MONGO_FALLBACK_INSTALLED = true;
//         console.warn("⚠️ MongoDB fallback installed: queries will return empty results until DB is reachable");
//       }
//     } catch (e) {
//       console.error("Error installing MongoDB fallback:", e?.message || e);
//     }

//     // Do not re-throw so app can continue serving fallback responses
//     return null;
//   }
// };

// export default connectMongoDB;