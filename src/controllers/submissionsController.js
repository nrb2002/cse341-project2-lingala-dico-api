const { ObjectId } = require('mongodb');
const submissionsModel = require('../models/submissionsModel');
const wordsModel = require('../models/wordsModel');

/** ****************************************************
 * CONTRIBUTORS
 *****************************************************/
const submitWord = async (req, res) => {
  //#swagger.tags=["Contributors"]
  //#swagger.security=[{"Bearer": []}]
  try {
    const submissions = await submissionsModel.collection();

    const submission = {
      sourceWord: req.body.sourceWord,
      targetWord: req.body.targetWord || '',
      synonyms: req.body.synonyms || [],
      partOfSpeech: req.body.partOfSpeech || '',
      example: req.body.example || '',
      pronunciation: req.body.pronunciation || '',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await submissions.insertOne(submission);
    res.status(201).json({ message: 'Submission received for review' });
  } catch (err) {
    console.error('submitWord:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/** ****************************************************
 * MODERATORS / ADMIN
 *****************************************************/
const getPendingSubmissions = async (req, res) => {
  //#swagger.tags=["Moderators Submissions"]
  //#swagger.security=[{"Bearer": []}]
  try {
    const submissions = await submissionsModel.collection();
    const results = await submissions.find({ status: 'pending' }).toArray();

    res.status(200).json(results);
  } catch (err) {
    console.error('getPendingSubmissions:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const validateSubmission = async (req, res) => {
  //#swagger.tags=["Moderators Submissions"]
  //#swagger.security=[{"Bearer": []}]
  try {
    const submissions = await submissionsModel.collection();
    const words = await wordsModel.collection();
    const submissionId = new ObjectId(req.params.id);

    // Find the submission
    const submission = await submissions.findOne({ _id: submissionId });
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Insert into words collection as validated
    await words.insertOne({
      sourceWord: submission.sourceWord,
      targetWord: submission.targetWord,
      synonyms: submission.synonyms,
      partOfSpeech: submission.partOfSpeech,
      example: submission.example,
      pronunciation: submission.pronunciation,
      status: 'validated',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Delete from submissions collection
    await submissions.deleteOne({ _id: submissionId });

    res.status(200).json({ message: 'Submission validated and moved to words collection' });
  } catch (err) {
    console.error('validateSubmission:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const rejectSubmission = async (req, res) => {
  //#swagger.tags=["Moderators Submissions"]
  //#swagger.security=[{"Bearer": []}]
  try {
    const submissions = await submissionsModel.collection();
    const submissionId = new ObjectId(req.params.id);

    // Delete the submission entirely
    const result = await submissions.deleteOne({ _id: submissionId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.status(200).json({ message: 'Submission rejected and deleted successfully' });
  } catch (err) {
    console.error('rejectSubmission:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = {
  submitWord,
  getPendingSubmissions,
  validateSubmission,
  rejectSubmission
};
