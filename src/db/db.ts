import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017';

const client = new MongoClient(mongoUri);
export const db = client.db('hw-03');

export const runDB = async () => {
  try {
    await client.connect();
    console.log('DB Connected successfully');
  } catch {
    console.log('! DB Not connect to server');
    await client.close();
  }
};
