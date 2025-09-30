const express = require('express');
const router = express.Router();
const Exam = require('../models/exam');
const { auth, isAdmin } = require('../middleware/auth');

// Get all exams
router.get('/', auth, async (req, res) => {
  try {
    const exams = await Exam.find({ isActive: true })
      .select('-questions.correctAnswer') 
      .populate('createdBy', 'name');
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single exam (for taking exam)
router.get('/:id', auth, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Remove correct answers for students
    if (req.user.role !== 'admin') {
      exam.questions = exam.questions.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options,
        marks: q.marks
      }));
    }

    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create exam (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const exam = new Exam({
      ...req.body,
      createdBy: req.user.id
    });
    await exam.save();
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update exam (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete exam (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;