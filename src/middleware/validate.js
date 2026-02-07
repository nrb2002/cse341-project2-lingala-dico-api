const validator = require('validator');
const mongodb = require('mongodb');

/**
 * Shared validation logic
 */
const isValidSourceWord = (value) => {
  if (!value || typeof value !== 'string') return false;

  // only letters, spaces, hyphens; 1-50 chars
  const regex = /^[a-zA-Z\s-]{1,50}$/;
  return regex.test(value);
};

/**
 * Validate POST / PUT BODY
 * For contributors: targetWord is optional
 */
const word = (req, res, next) => {
  try {
    if (!req.body) throw { message: 'Request body is required', status: 400 };

    const { sourceWord, targetWord, synonyms } = req.body;

    if (!sourceWord || !isValidSourceWord(sourceWord)) {
      throw { message: 'Invalid sourceWord', status: 400 };
    }

    if (targetWord && (typeof targetWord !== 'string' || validator.isEmpty(targetWord))) {
      throw { message: 'Invalid targetWord', status: 400 };
    }

    if (synonyms && !Array.isArray(synonyms)) {
      throw { message: 'Synonyms must be an array', status: 400 };
    }

    // normalize lowercase
    req.body.sourceWord = sourceWord.toLowerCase();
    if (targetWord) req.body.targetWord = targetWord.toLowerCase();
    if (synonyms) req.body.synonyms = synonyms.map((s) => s.toLowerCase());

    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Validate URL PARAM :sourceWord (GET)
 */
const sourceWordParam = (req, res, next) => {
  try {
    const { sourceWord } = req.params;

    if (!isValidSourceWord(sourceWord)) {
      throw { message: 'Invalid sourceWord parameter', status: 400 };
    }

    req.params.sourceWord = sourceWord.toLowerCase();
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Validate MongoDB ObjectId (PUT / DELETE)
 */
const checkId = (req, res, next) => {
  try {
    if (!mongodb.ObjectId.isValid(req.params.id)) {
      throw { message: 'Invalid ID format', status: 400 };
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  word,
  sourceWordParam,
  checkId
};
