const mongodb = require('mongodb');
const Word = require('../models/Word');
const { connectDB } = require('../db/connect');

/** ****************************************************
 *  PUBLIC USERS ENDPOINTS 
 *****************************************************/
const getValidatedWord = async (req, res, next) => {
  //#swagger.tags=["Public Users' Endpoint"]
  //#swagger.summary="Get a word's translation"
  //#swagger.description="Retrieve a validated English–Lingala dictionary entry."
  /* #swagger.parameters['sourceWord'] = {
      in: 'path',
      required: true,
      type: 'string',
      example: 'love'
  } */
  try {
    const db = await connectDB();
    const result = await db.collection('words').findOne({
      sourceWord: req.params.sourceWord,
      status: 'validated'
    });

    if (!result) {
      const error = new Error('Word not found');
      error.status = 404;
      throw error;
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/** ****************************************************
 *  CONTRIBUTORS' ENDPOINTS 
 *****************************************************/
const submitWord = async (req, res, next) => {
  //#swagger.tags=["Contributors' Endpoint"]
  //#swagger.summary="Submit a new word"
  //#swagger.description="Submit a new dictionary entry for moderation."
  /* #swagger.parameters["body"] = {
      in: "body",
      description: "New word submission",
      required: true,
      schema: {
        sourceWord: "love",
        targetWord: "bolingo",
        synonyms: ["amour", "liking"],
        partOfSpeech: "noun",
        example: "I love you"
      }
  } */
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

/** ****************************************************
 *  MODERATORS/ADMIN ENDPOINTS 
 *****************************************************/
const validateWord = async (req, res, next) => {
  //#swagger.tags=["Moderators' Endpoints"]
  //#swagger.summary="Validate a word submission"
  /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'Word ID',
        required: true,
        type: 'string'
  } */
  try {
    const db = await connectDB();
    const result = await db.collection('words').updateOne(
      { _id: new mongodb.ObjectId(req.params.id) },
      { $set: { status: 'validated', updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      const error = new Error('Word not found');
      error.status = 404;
      throw error;
    }

    res.status(200).json({ message: 'Word validated successfully' });
  } catch (err) {
    next(err);
  }
};

const filterByStatus = async (req, res, next) => {
  //#swagger.tags=["Moderators' Endpoints"]
  //#swagger.summary="Filter words by status"
  /* #swagger.parameters['status'] = {
        in: 'path',
        description: 'Status filter (pending/validated)',
        required: true,
        type: 'string'
  } */
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
  //#swagger.tags=["Moderators' Endpoints"]
  //#swagger.summary="List all words in the dictionary"
  try {
    const db = await connectDB();
    const results = await db.collection('words').find().toArray();
    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

const deleteWord = async (req, res, next) => {
  //#swagger.tags=["Moderators' Endpoints"]
  //#swagger.summary="Delete a word by ID"
  /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'Word ID',
        required: true,
        type: 'string'
  } */
  try {
    const db = await connectDB();
    const result = await db.collection('words').deleteOne({ _id: new mongodb.ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      const error = new Error('Word not found');
      error.status = 404;
      throw error;
    }

    res.status(200).json({ message: 'Word deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllWords,
  filterByStatus,
  getValidatedWord,
  submitWord,
  validateWord,
  deleteWord
};
