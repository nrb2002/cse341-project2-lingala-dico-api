const { MongoClient } = require('mongodb');

let db;

const connectDB = async () => {
  if (db) return db;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in environment variables');
  }

  if (!process.env.DB_NAME) {
    throw new Error('DB_NAME is missing in environment variables');
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  
  await client.connect();
  
  db = client.db(process.env.DB_NAME);
  //console.log('MongoDB connected');
  return db;
};

module.exports = { connectDB };
