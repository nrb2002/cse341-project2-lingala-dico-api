const validator = require('validator');
const mongodb = require('mongodb');

/**
 * Shared validation logic
 */
const isValidSourceWord = (value) => {
  if (!value || typeof value !== 'string') return false;

  // allow letters, hyphen, apostrophe
  const regex = /^[a-zA-Z'-]{1,50}$/;
  return regex.test(value);
};

/**
 * Validate request BODY (POST / PUT)
 */
const word = (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ message: 'Request body is required' });
  }
  
  const { sourceWord, targetWord } = req.body;

  // required fields
  if (!sourceWord || !targetWord) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  // sourceWord validation
  if (!isValidSourceWord(sourceWord)) {
    return res.status(400).json({ message: 'Invalid sourceWord' });
  }

  // targetWord validation
  if (typeof targetWord !== 'string' || validator.isEmpty(targetWord)) {
    return res.status(400).json({ message: 'Invalid targetWord' });
  }

  // normalize
  req.body.sourceWord = sourceWord.toLowerCase();
  req.body.targetWord = targetWord.toLowerCase();

  next();
};

/**
 * Validate URL PARAM :sourceWord (GET)
 */
const sourceWordParam = (req, res, next) => {
  const { sourceWord } = req.params;

  if (!isValidSourceWord(sourceWord)) {
    return res.status(400).json({ message: 'Invalid sourceWord parameter' });
  }

  // normalize
  req.params.sourceWord = sourceWord.toLowerCase();
  next();
};

/**
 * Validate MongoDB ObjectId (PUT / DELETE)
 */
const checkId = (req, res, next) => {
  if (!mongodb.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  next();
};

module.exports = {
  word,
  sourceWordParam,
  checkId
};
