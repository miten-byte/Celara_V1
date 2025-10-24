import { MongoClient, Db, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jewelry-store';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  try {
    if (cachedClient && cachedDb) {
      console.log('Using cached MongoDB connection');
      return { client: cachedClient, db: cachedDb };
    }

    console.log('Connecting to MongoDB...', MONGODB_URI);
    const client = await MongoClient.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    const db = client.db();

    cachedClient = client;
    cachedDb = db;

    console.log('✅ Successfully connected to MongoDB');
    console.log('Database name:', db.databaseName);

    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.error('MongoDB URI:', MONGODB_URI.replace(/\/\/.*@/, '//<credentials>@'));
    throw new Error(`Failed to connect to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export { ObjectId };
