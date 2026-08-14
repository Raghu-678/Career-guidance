import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer = null;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/career_guidance';

  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected: ${uri}`);
    return { mode: 'external', uri };
  } catch (err) {
    console.warn(`External MongoDB unavailable (${err.message}). Starting in-memory fallback...`);
    memoryServer = await MongoMemoryServer.create();
    const memUri = memoryServer.getUri('career_guidance');
    await mongoose.connect(memUri);
    console.log(`MongoDB in-memory fallback connected: ${memUri}`);
    return { mode: 'memory', uri: memUri };
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
