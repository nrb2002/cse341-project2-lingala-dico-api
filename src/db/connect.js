const { MongoClient } = require('mongodb');

let db;

const mongoDB = async () => {
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
  
  //For testing purposes
  //console.log('MongoDB connected');
  (async () => {
    const db = await mongoDB();
    const count = await db.collection('words').countDocuments();
    console.log("Words count:", count);
  })();
  
  return db;
};

module.exports = { mongoDB };
