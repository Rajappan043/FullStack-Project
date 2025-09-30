const express = require('express');
const router = express.Router();
const Result = require('../models/result');
const Exam = require('../models/exam');
const { auth, isAdmin } = require('../middleware/auth');

// Submit exam
router.post('/submit', auth, async (req, res) => {
  try {
    const { examId, answers } = req.body;

    // Get exam with correct answers
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Calculate score
    let score = 0;
    exam.questions.forEach((question, index) => {
      const userAnswer = answers.find(a => a.questionId.toString() === question._id.toString());
      if (userAnswer && userAnswer.selectedAnswer === question.correctAnswer) {
        score += question.marks;
      }
    });

    const percentage = (score / exam.totalMarks) * 100;

    // Save result
    const result = new Result({
      student: req.user.id,
      exam: examId,
      answers,
      score,
      totalMarks: exam.totalMarks,
      percentage
    });

    await result.save();

    res.status(201).json({
      message: 'Exam submitted successfully',
      result: {
        score,
        totalMarks: exam.totalMarks,
        percentage: percentage.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student's results
router.get('/my-results', auth, async (req, res) => {
  try {
    const results = await Result.find({ student: req.user.id })
      .populate('exam', 'title description')
      .sort({ submittedAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all results (admin only)
router.get('/all', auth, isAdmin, async (req, res) => {
  try {
    const results = await Result.find()
      .populate('student', 'name email')
      .populate('exam', 'title')
      .sort({ submittedAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;