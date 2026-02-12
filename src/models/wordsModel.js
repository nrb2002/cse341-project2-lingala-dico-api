const { connectDB } = require('../db/connect');

const collection = async () => {
  const db = await connectDB();
  return db.collection('words');
};

module.exports = {
  collection
};
