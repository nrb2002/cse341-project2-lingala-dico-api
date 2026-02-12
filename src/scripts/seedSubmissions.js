// scripts/seedSubmissions.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'project2';

const sampleSubmissions = [
  {
    sourceWord: "hello",
    targetWord: "mbote",
    synonyms: ["hi", "hey"],
    partOfSpeech: "interjection",
    example: "Hello, how are you?",
    pronunciation: "",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    sourceWord: "water",
    targetWord: "mayi",
    synonyms: ["liquid"],
    partOfSpeech: "noun",
    example: "I drink water",
    pronunciation: "",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    sourceWord: "work",
    targetWord: "mosala",
    synonyms: ["job", "labor"],
    partOfSpeech: "noun",
    example: "I am going to work",
    pronunciation: "",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    sourceWord: "run",
    targetWord: "kopumbwa",
    synonyms: ["jog"],
    partOfSpeech: "verb",
    example: "He runs fast",
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
    const collection = db.collection("submissions");

    // Clear existing submissions for clean testing
    await collection.deleteMany({});
    console.log("Cleared existing submissions");

    const result = await collection.insertMany(sampleSubmissions);
    console.log(`Inserted ${result.insertedCount} sample submissions`);
  } catch (err) {
    console.error("Error seeding submissions:", err);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
})();
