const HealthRecord = require('../models/HealthRecord');
const User = require('../models/User');

exports.createOrUpdateStudentRecord = async (req, res) => {
  try {
    const { bloodGroup, healthIssues, allergies, medicalNotes } = req.body;

    if (!bloodGroup) {
      return res.status(400).json({ message: 'Blood group is required' });
    }

    const studentId =
      req.user.role === 'student' ? req.user._id : req.body.studentId;

    if (!studentId) {
      return res
        .status(400)
        .json({ message: 'studentId is required for staff requests' });
    }

    const existing = await HealthRecord.findOne({ studentId });

    let record;
    if (existing) {
      existing.bloodGroup = bloodGroup;
      existing.healthIssues = healthIssues || '';
      existing.allergies = allergies || '';
      existing.medicalNotes = medicalNotes || '';
      record = await existing.save();
    } else {
      record = await HealthRecord.create({
        studentId,
        bloodGroup,
        healthIssues,
        allergies,
        medicalNotes
      });
    }

    res.status(201).json(record);
  } catch (err) {
    console.error('Create health record error', err.message);
    res.status(500).json({ message: 'Server error creating health record' });
  }
};

exports.getCurrentStudentRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findOne({ studentId: req.user._id });
    if (!record) {
      return res.status(404).json({ message: 'No health record found' });
    }
    res.json(record);
  } catch (err) {
    console.error('Get student record error', err.message);
    res.status(500).json({ message: 'Server error fetching health record' });
  }
};

exports.getAllStudentsWithRecords = async (req, res) => {
  try {
    const { search = '' } = req.query;

    const studentFilter = {
      role: 'student',
      ...(search
        ? {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } }
            ]
          }
        : {})
    };

    const students = await User.find(studentFilter).select('-password');

    const studentIds = students.map((s) => s._id);
    const records = await HealthRecord.find({
      studentId: { $in: studentIds }
    });

    const recordsMap = {};
    records.forEach((r) => {
      recordsMap[String(r.studentId)] = r;
    });

    const result = students.map((s) => ({
      student: s,
      record: recordsMap[String(s._id)] || null
    }));

    res.json(result);
  } catch (err) {
    console.error('Get all students error', err.message);
    res.status(500).json({ message: 'Server error fetching students' });
  }
};

exports.getSingleStudentRecord = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findOne({ _id: studentId, role: 'student' }).select(
      '-password'
    );
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const record = await HealthRecord.findOne({ studentId });

    res.json({ student, record });
  } catch (err) {
    console.error('Get single student error', err.message);
    res.status(500).json({ message: 'Server error fetching student record' });
  }
};

