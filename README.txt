Folder Structure
project-root/
│
├─ db/
│  └─ connect.js
│
├─ controllers/
│  └─ wordsController.js
│
├─ middleware/
│  ├─ validate.js
│  ├─ auth.js
│  └─ errorHandler.js
│
├─ models/
│  └─ Word.js
│
├─ routes/
│  ├─ index.js
│  ├─ wordsRoutes.js
│  └─ swaggerRoutes.js
│
├─ .env
├─ server.js
└─ package.json

1️⃣ db/connect.js
const { MongoClient } = require('mongodb');

let db;

const connectDB = async () => {
  if (db) return db;
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db(process.env.DB_NAME);
  console.log('MongoDB connected');
  return db;
};

module.exports = { connectDB };

2️⃣ models/Word.js
const { ObjectId } = require('mongodb');

class Word {
  constructor({
    sourceWord,
    targetWord = '',
    synonyms = [],
    partOfSpeech = '',
    example = '',
    pronunciation = '',
    status = 'pending',
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.sourceWord = sourceWord;
    this.targetWord = targetWord;
    this.synonyms = synonyms;
    this.partOfSpeech = partOfSpeech;
    this.example = example;
    this.pronunciation = pronunciation;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static collection(db) {
    return db.collection('words');
  }
}

module.exports = Word;

3️⃣ middleware/validate.js
const mongodb = require('mongodb');
const validator = require('validator');

// letters, spaces, hyphens only
const isValidSourceWord = (value) =>
  typeof value === 'string' && /^[a-zA-Z\s-]{1,50}$/.test(value);

// Validate POST/PUT body (contributors can have optional targetWord)
const word = (req, res, next) => {
  try {
    if (!req.body) throw { message: 'Request body required', status: 400 };
    const { sourceWord, targetWord, synonyms } = req.body;

    if (!sourceWord || !isValidSourceWord(sourceWord))
      throw { message: 'Invalid sourceWord', status: 400 };

    if (targetWord && (typeof targetWord !== 'string' || validator.isEmpty(targetWord)))
      throw { message: 'Invalid targetWord', status: 400 };

    if (synonyms && !Array.isArray(synonyms))
      throw { message: 'Synonyms must be an array', status: 400 };

    req.body.sourceWord = sourceWord.toLowerCase();
    if (targetWord) req.body.targetWord = targetWord.toLowerCase();
    if (synonyms) req.body.synonyms = synonyms.map((s) => s.toLowerCase());

    next();
  } catch (err) {
    next(err);
  }
};

// Validate URL param :sourceWord
const sourceWordParam = (req, res, next) => {
  try {
    const { sourceWord } = req.params;
    if (!isValidSourceWord(sourceWord))
      throw { message: 'Invalid sourceWord parameter', status: 400 };
    req.params.sourceWord = sourceWord.toLowerCase();
    next();
  } catch (err) {
    next(err);
  }
};

// Validate MongoDB ObjectId
const checkId = (req, res, next) => {
  try {
    if (!mongodb.ObjectId.isValid(req.params.id))
      throw { message: 'Invalid ID format', status: 400 };
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { word, sourceWordParam, checkId };

4️⃣ middleware/auth.js

(simple stub for moderators/admins, can expand later)

const requiresAuth = (req, res, next) => {
  // Stub: in production, verify JWT or session
  const role = req.headers['x-role'];
  if (role !== 'moderator' && role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: insufficient privileges' });
  }
  next();
};

module.exports = { requiresAuth };

5️⃣ middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
};

module.exports = errorHandler;

6️⃣ controllers/wordsController.js
const mongodb = require('mongodb');
const { connectDB } = require('../db/connect');

/** PUBLIC */
const getValidatedWord = async (req, res, next) => {
  //#swagger.tags=["Public"]
  //#swagger.summary="Get a validated word"
  /* #swagger.parameters['sourceWord'] = { in:'path', required:true, type:'string', example:'love' } */
  try {
    const db = await connectDB();
    const result = await db.collection('words').findOne({
      sourceWord: req.params.sourceWord,
      status: 'validated'
    });
    if (!result) throw { message: 'Word not found', status: 404 };
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/** CONTRIBUTORS */
const submitWord = async (req, res, next) => {
  //#swagger.tags=["Contributors"]
  //#swagger.summary="Submit a new word"
  /* #swagger.parameters['body'] = { in:'body', required:true, schema:{sourceWord:'love', targetWord:'bolingo', synonyms:['amour'], partOfSpeech:'noun', example:'I love you'} } */
  try {
    const db = await connectDB();
    const newWord = {
      sourceWord: req.body.sourceWord,
      targetWord: req.body.targetWord || '',
      synonyms: req.body.synonyms || [],
      partOfSpeech: req.body.partOfSpeech || '',
      example: req.body.example || '',
      pronunciation: '',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await db.collection('words').insertOne(newWord);
    res.status(201).json({ message: 'Submission received for review' });
  } catch (err) {
    next(err);
  }
};

/** MODERATOR/ADMIN */
const validateWord = async (req, res, next) => {
  //#swagger.tags=["Moderators/Admins"]
  //#swagger.summary="Validate a pending word"
  /* #swagger.parameters['id'] = { in:'path', required:true, type:'string' } */
  try {
    const db = await connectDB();
    const result = await db.collection('words').updateOne(
      { _id: new mongodb.ObjectId(req.params.id) },
      { $set: { status: 'validated', updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) throw { message: 'Word not found', status: 404 };
    res.status(200).json({ message: 'Word validated successfully' });
  } catch (err) {
    next(err);
  }
};

const filterByStatus = async (req, res, next) => {
  //#swagger.tags=["Moderators/Admins"]
  //#swagger.summary="Filter words by status"
  /* #swagger.parameters['status'] = { in:'path', required:true, type:'string', example:'pending' } */
  try {
    const db = await connectDB();
    const results = await db.collection('words')
      .find({ status: req.params.status })
      .toArray();
    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

const getAllWords = async (req, res, next) => {
  //#swagger.tags=["Moderators/Admins"]
  //#swagger.summary="List all words"
  try {
    const db = await connectDB();
    const results = await db.collection('words').find().toArray();
    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

const deleteWord = async (req, res, next) => {
  //#swagger.tags=["Moderators/Admins"]
  //#swagger.summary="Delete a word"
  /* #swagger.parameters['id'] = { in:'path', required:true, type:'string' } */
  try {
    const db = await connectDB();
    const result = await db.collection('words').deleteOne({ _id: new mongodb.ObjectId(req.params.id) });
    if (result.deletedCount === 0) throw { message: 'Word not found', status: 404 };
    res.status(200).json({ message: 'Word deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getValidatedWord,
  submitWord,
  validateWord,
  filterByStatus,
  getAllWords,
  deleteWord
};

7️⃣ routes/wordsRoutes.js
const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const wordsController = require('../controllers/wordsController');

// PUBLIC
router.get('/:sourceWord', validate.sourceWordParam, wordsController.getValidatedWord);

// CONTRIBUTORS
router.post('/', validate.word, wordsController.submitWord);

// MODERATOR/ADMIN
router.put('/:id/validate', auth.requiresAuth, validate.checkId, wordsController.validateWord);
router.get('/status/:status', auth.requiresAuth, wordsController.filterByStatus);
router.get('/all', auth.requiresAuth, wordsController.getAllWords);
router.delete('/:id', auth.requiresAuth, validate.checkId, wordsController.deleteWord);

module.exports = router;

8️⃣ routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send('English–Lingala Dictionary API is running'));

module.exports = router;

9️⃣ server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db/connect');
const wordsRoutes = require('./routes/wordsRoutes');
const swaggerRoutes = require('./routes/swaggerRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/', require('./routes'));
app.use('/v1/words', wordsRoutes);
app.use('/v1/api-docs', swaggerRoutes);

// Centralized error handler
app.use(errorHandler);

// Connect DB and start server
connectDB()
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });