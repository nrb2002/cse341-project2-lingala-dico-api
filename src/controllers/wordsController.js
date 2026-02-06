const mongodb = require('mongodb');
const Word = require('../models/Word');

//Get all words
const getAllWords = async (req, res, next) => {
  //#swagger.tags=["API Endpoints"]
  //#swagger.summary="Find all words"
  //#swagger.description="List all words from the dictionary."
  try {
    const result = await (await Word.collection()).find().toArray();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

//Get one specific word's translation
const getSingleWord = async (req, res, next) => {
  //#swagger.tags=["API Endpoints"]
  //#swagger.summary="Find the translation of a word."
  //#swagger.description="Get a specific word's translation using its source word."
  /* #swagger.parameters['sourceWord'] = {
      in: 'path',
      description: 'English source word',
      required: true,
      type: 'string',
      example: 'love'
  } */

  try {
    const sourceWord = req.params.sourceWord.toLowerCase();

    const result = await (await Word.collection()).findOne({
      sourceWord: sourceWord
    });

    if (!result) {
      return res.status(404).json({ message: 'Word not found' });
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};


const createWord = async (req, res, next) => {
  //#swagger.tags=["API Endpoints"]
  //#swagger.summary="Create New Word"
  //#swagger.description="Add a new word to the dictionary. "
  /* #swagger.parameters["body"] = {
    in: "body",
    description: "Enter New word",
    required: true,
    schema: { 
      "sourceLang": "en",
      "targetLang": "ln",
      "sourceWord": "love",
      "targetWord": "bolingo",
      "partOfSpeech": "noun",
      "examples": [
        {
          "source": "I love you",
          "target": "Nalingi yo"
        }
      ]
    }
  } */
  try {
    const newWord = {
      sourceLang: req.body.sourceLang,
      targetLang: req.body.targetLang,
      sourceWord: req.body.sourceWord,
      targetWord: req.body.targetWord,
      partOfSpeech: req.body.partOfSpeech,
      examples: req.body.examples || [],
      createdAt: new Date()
    };

    const response = await (await Word.collection()).insertOne(newWord);
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

const updateWord = async (req, res, next) => {
  //#swagger.tags=["API Endpoints"]
  //#swagger.summary="Edit Word"
  //#swagger.description="Edit a specific word and save it to the dictionary. "
/* #swagger.parameters["body"] = {
  in: "body",
  description: "Updated word fields",
  required: true,
  schema: {
    sourceLang: "en",
    targetLang: "ln",
    sourceWord: "love",
    targetWord: "bolingo",
    partOfSpeech: "noun",
    examples: [
      { source: "I love you", target: "Nalingi yo" }
    ]
  }
} */

  try {
    const id = new mongodb.ObjectId(req.params.id);
    const response = await (await Word.collection()).updateOne(
      { _id: id },
      { $set: req.body }
    );

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'Word not found' });
    }

    res.status(204).send();

  } catch (err) {
      next(err);
  }
};

const deleteWord = async (req, res, next) => {
  //#swagger.tags=["API Endpoints"]
  //#swagger.summary="Delete word"
  //#swagger.description="Delete a word from the dictionary by ID."
  /* #swagger.parameters['id'] = {
      in: 'path',
      description: 'Word ID',
      required: true,
      type: 'string'
  } */

  try {
    const id = new mongodb.ObjectId(req.params.id);
    await (await Word.collection()).deleteOne({ _id: id });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};


module.exports = {
  getAllWords,
  getSingleWord,
  createWord,
  updateWord,
  deleteWord
};
