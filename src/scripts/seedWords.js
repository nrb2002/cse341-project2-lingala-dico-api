// scripts/seedWords.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'project2';

const sampleWords = [
  {
    sourceWord: "love",
    targetWord: "bolingo",
    synonyms: ["amour", "liking"],
    partOfSpeech: "noun",
    example: "I love you",
    pronunciation: "",
    status: "validated",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    sourceWord: "friend",
    targetWord: "moninga",
    synonyms: ["buddy", "companion"],
    partOfSpeech: "noun",
    example: "He is my friend",
    pronunciation: "",
    status: "validated",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    sourceWord: "eat",
    targetWord: "kolia",
    synonyms: ["consume", "devour"],
    partOfSpeech: "verb",
    example: "I eat rice",
    pronunciation: "",
    status: "validated",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    sourceWord: "happy",
    targetWord: "esengo",
    synonyms: ["joyful", "pleased"],
    partOfSpeech: "adjective",
    example: "I am happy",
    pronunciation: "",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

(async () => {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(DB_NAME);
    const collection = db.collection("words");

    // Clear existing words for clean testing
    await collection.deleteMany({});
    console.log("Cleared existing words");

    const result = await collection.insertMany(sampleWords);
    console.log(`Inserted ${result.insertedCount} sample words`);
  } catch (err) {
    console.error("Error seeding words:", err);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
})();
