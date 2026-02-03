const mongodb = require('mongodb');
const Word = require('../models/Word');

const getAllWords = async (req, res, next) => {
  try {
    const result = await (await Word.collection()).find().toArray();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const createWord = async (req, res, next) => {
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
  try {
    const id = new mongodb.ObjectId(req.params.id);
    const response = await (await Word.collection()).updateOne(
      { _id: id },
      { $set: req.body }
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const deleteWord = async (req, res, next) => {
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
  createWord,
  updateWord,
  deleteWord
};
