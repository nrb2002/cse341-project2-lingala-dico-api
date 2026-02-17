const { ObjectId } = require('mongodb');
const wordsModel = require('../models/wordsModel');
const submissionsModel = require('../models/submissionsModel');

/** ****************************************************
 * PUBLIC USERS
 *****************************************************/
const getWordBySource = async (req, res) => {
  //#swagger.tags=["Public Users"]
  //#swagger.summary="Get a word's translation. "
  //#swagger.description="Retrieve a validated dictionary entry by its source word. Public endpoint."

  try {
    const words = await wordsModel.collection();

    const result = await words.findOne({
      sourceWord: req.params.sourceWord
    });

    if (!result) {
      return res.status(404).json({ message: 'Word not found' });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error('getWordBySource:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/** ****************************************************
 * ADMINS ENDPOINTS
 *****************************************************/
const getAllWords = async (req, res) => {
  //#swagger.tags=["Admins"]
  //#swagger.security=[{"Bearer": []}]
  //#swagger.summary="Get all validated words fro the 'words' collection."
  //#swagger.description="Retrieve all dictionary entries, no matter the status. You must an admin to perform this operation. "
  try {
    const words = await wordsModel.collection();
    const results = await words.find().toArray();

    res.status(200).json(results);
  } catch (err) {
    console.error('getAllWords:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getWordsByStatus = async (req, res) => {
  //#swagger.tags=["Admins"]
  //#swagger.security=[{"Bearer": []}]
  //#swagger.summary="Get words and submissions by status"
  //#swagger.description="Returns all words and submissions matching the provided status."

  try {
    const status = req.params.status; // "pending" or "validated"

    const wordsCollection = await wordsModel.collection();
    const submissionsCollection = await submissionsModel.collection();

    const [words, submissions] = await Promise.all([
      wordsCollection.find({ status }).toArray(),
      submissionsCollection.find({ status }).toArray()
    ]);

    res.status(200).json({
      status,
      total: words.length + submissions.length,
      words,
      submissions
    });
  } catch (err) {
    console.error('getWordsByStatus:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//Insert new word
const createWordAdmin = async (req, res) => {
  //#swagger.tags=["Admins"]
  //#swagger.security=[{"Bearer": []}]
  //#swagger.summary="Create a new word. "
  //#swagger.description="Words created by Admins are automatically validated; no need to review. "
  try {
    const word = {
      sourceWord: req.body.sourceWord,
      targetWord: req.body.targetWord,
      synonyms: req.body.synonyms || [],
      partOfSpeech: req.body.partOfSpeech,
      example: req.body.example || '',
      pronunciation: req.body.pronunciation || '',
      status: 'validated', // validate automatically since entered by admin
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await wordsModel.collection().insertOne(word);

    if (result.acknowledged) {
      res.status(201).json({
        message: 'Word created successfully by admin!',
        id: result.insertedId
      });
    } else {
      res.status(500).json({ message: 'Failed to create word' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const editWord = async (req, res) => {
  //#swagger.tags=["Admins"]
  //#swagger.security=[{"Bearer": []}]
    /* #swagger.parameters['id'] = {
        in: 'path',
        description: 'Word ID to update',
        required: true,
        type: 'string'
  } */
  /* #swagger.parameters["body"] = {
        in: "body",
        description: "Fields to update for a word",
        required: true,
        schema: {
          sourceWord: "love",
          targetWord: "bolingo",
          synonyms: ["amour", "liking"],
          partOfSpeech: "noun",
          example: "I love you",
          pronunciation: "bo-lin-go",
          status: "validated"
        }
  } */
  try {
    const words = await wordsModel.collection();
    const wordId = new ObjectId(req.params.id);

    const updateFields = {
      ...req.body,
      updatedAt: new Date()
    };

    const result = await words.updateOne(
      { _id: wordId },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Word not found' });
    }

    res.status(200).json({ message: 'Word updated successfully' });
  } catch (err) {
    console.error('editWord:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteWord = async (req, res) => {
  //#swagger.tags=["Admins"]
  //#swagger.security=[{"Bearer": []}]
  //#swagger.summary="Delete a word from the dictionary. "
  //#swagger.description="Can delete a word with the status of 'validated'. Please switch the Moderator role to delete a Submission. "
  try {
    const words = await wordsModel.collection();
    const wordId = new ObjectId(req.params.id);

    const result = await words.deleteOne({ _id: wordId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Word not found' });
    }

    res.status(200).json({ message: 'Word deleted successfully' });
  } catch (err) {
    console.error('deleteWord:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getWordBySource,
  getAllWords,
  getWordsByStatus,
  createWordAdmin,
  editWord,
  deleteWord
};
