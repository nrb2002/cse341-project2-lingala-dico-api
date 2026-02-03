const { ObjectId } = require('mongodb');
const { connectDB } = require('../database/config');

const collection = async () => {
  const db = await connectDB();
  return db.collection('submissions');
};

module.exports = {
  collection
};