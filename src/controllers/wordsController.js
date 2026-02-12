const { ObjectId } = require('mongodb');
const wordsModel = require('../models/wordsModel');

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
 * ADMIN / MODERATORS
 *****************************************************/
const getAllWords = async (req, res) => {
  //#swagger.tags=["Admins only"]
  //#swagger.security=[{"Bearer": []}]
  //#swagger.summary="Get all words. "
  //#swagger.description="Retrieve all dictionary entries, no matter the status."
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
  //#swagger.tags=["Admins only"]
  //#swagger.security=[{"Bearer": []}]
  try {
    const status = req.params.status; // "pending" or "validated"
    const words = await wordsModel.collection();

    const results = await words.find({ status }).toArray();
    res.status(200).json(results);
  } catch (err) {
    console.error('getWordsByStatus:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const editWord = async (req, res) => {
  //#swagger.tags=["Admins only"]
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
  //#swagger.tags=["Admins only"]
  //#swagger.security=[{"Bearer": []}]
  //#swagger.summary="Delete a word from the dictionary. "
  //#swagger.description="Can only delete a word with the status of 'validated'. Please switch the Moderator role to delete a Submission. "
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
  editWord,
  deleteWord
};
