import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please add MONGO_URI in .env.local");
}

async function dbConnect() {
  try {
    // Agar already connected hai to dobara connect na kare
    if (mongoose.connections[0].readyState) {
      return;
    }
    await mongoose.connect(MONGO_URI);
     console.log("✅ MongoDB connected successfully!");;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export default dbConnect;
