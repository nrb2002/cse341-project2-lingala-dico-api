const validator = require('validator');
const mongodb = require('mongodb');

const word = (req, res, next) => {
  const { sourceWord, targetWord } = req.body;

  if (!sourceWord || !targetWord) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  if (!validator.isLength(sourceWord, { min: 1 })) {
    return res.status(400).json({ message: 'Invalid sourceWord' });
  }

  next();
};

//ID validator
const checkId = (req, res, next) => {
  if (!mongodb.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  next();
};


module.exports = {
  word,
  checkId
};
