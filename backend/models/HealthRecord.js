const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bloodGroup: { type: String, required: true },
    healthIssues: { type: String, default: '' },
    allergies: { type: String, default: '' },
    medicalNotes: { type: String, default: '' }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

module.exports = mongoose.model('HealthRecord', healthRecordSchema);

