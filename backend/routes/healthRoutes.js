const express = require('express');
const router = express.Router();
const {
  createOrUpdateStudentRecord,
  getCurrentStudentRecord,
  getAllStudentsWithRecords,
  getSingleStudentRecord
} = require('../controllers/healthController');
const { protect, staffOnly } = require('../middleware/authMiddleware');

router.post('/create', protect, createOrUpdateStudentRecord);
router.get('/student', protect, getCurrentStudentRecord);
router.get('/all-students', protect, staffOnly, getAllStudentsWithRecords);
router.get('/:studentId', protect, staffOnly, getSingleStudentRecord);

module.exports = router;

