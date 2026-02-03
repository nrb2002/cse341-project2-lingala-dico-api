const validator = require('validator');

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

module.exports = {
  word
};
