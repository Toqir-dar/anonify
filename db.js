// db.js
import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://aaishadar124:Toqir%40123@bookstore.ezwzvz6.mongodb.net/?retryWrites=true&w=majority&appName=BookStore";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log("✅ MongoDB Connected!");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDB;
