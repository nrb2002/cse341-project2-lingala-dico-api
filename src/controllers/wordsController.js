const mongodb = require('mongodb');
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
      return res.status(404).json({ message: 'Word not found' });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("getValidatedWord error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
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
    console.error("submitWord error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

/** ****************************************************
 *  MODERATORS/ADMIN ENDPOINTS 
 *****************************************************/
const validateWord = async (req, res, next) => {
  //#swagger.tags=["Moderators' Endpoints"]
  //#swagger.summary="Validate a word submission and update all fields"
  //#swagger.security=[{"Bearer": []}]
  /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'Word ID',
        required: true,
        type: 'string'
  } */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Fields to update',
        required: true,
        schema: {
          sourceWord: "love",
          targetWord: "bolingo",
          synonyms: ["amour", "liking"],
          partOfSpeech: "noun",
          example: "I love you",
          pronunciation: "bo-lin-go"
        }
  } */

  try {
    const db = await connectDB();

    // Only include fields sent in request body
    const updateFields = {
      ...req.body,
      status: 'validated',   // always enforce validated
      updatedAt: new Date()  // update timestamp
    };

    const result = await db.collection('words').updateOne(
      { _id: new mongodb.ObjectId(req.params.id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Word not found' });
    }

    res.status(200).json({ message: 'Word validated and updated successfully' });
  } catch (err) {
    console.error("validateWord error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


const filterByStatus = async (req, res, next) => {
  //#swagger.tags=["Moderators' Endpoints"]
  //#swagger.summary="Filter words by status"
  //#swagger.security=[{"Bearer": []}]
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
    console.error("filterByStatus error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

const getAllWords = async (req, res, next) => {
  //#swagger.tags=["Moderators' Endpoints"]
  //#swagger.summary="List all words in the dictionary"
  //#swagger.security=[{"Bearer": []}]
  try {
    const db = await connectDB();
    const results = await db.collection('words').find().toArray();

    res.status(200).json(results || []);
  } catch (err) {
    console.error("getAllWords error:", err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

const deleteWord = async (req, res, next) => {
  //#swagger.tags=["Moderators' Endpoints"]
  //#swagger.summary="Delete a word by ID"
  //#swagger.security=[{"Bearer": []}]
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
      return res.status(404).json({ message: 'Word not found' });
    }

    res.status(200).json({ message: 'Word deleted successfully' });
  } catch (err) {
    console.error("deleteWord error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
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
