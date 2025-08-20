const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  qrCode: {
    type: String,
    required: true
  },
  attended: {
    type: Boolean,
    default: false
  },
  attendanceTime: {
    type: Date
  }
});

// Ensure a participant can only register once for an event
RegistrationSchema.index({ event: 1, participant: 1 }, { unique: true });

module.exports = mongoose.model('Registration', RegistrationSchema);