const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { authenticate, authorize } = require('../middleware/auth');

// @route   POST api/attendance/mark
// @desc    Mark attendance using QR code
// @access  Private (organizer, volunteer, admin)
router.post('/mark', 
  authenticate, 
  authorize('organizer', 'volunteer', 'admin'),
  async (req, res) => {
    try {
      const { registrationId } = req.body;
      
      // Extract event ID and participant ID from registration ID
      const [eventId, participantId] = registrationId.split('-');
      
      // Find the registration
      const registration = await Registration.findOne({
        event: eventId,
        participant: participantId
      });
      
      if (!registration) {
        return res.status(404).json({ msg: 'Registration not found' });
      }
      
      // Check if user is authorized to mark attendance
      const event = await Event.findById(eventId);
      
      if (!event) {
        return res.status(404).json({ msg: 'Event not found' });
      }
      
      const isOrganizer = event.organizer.toString() === req.user.id;
      const isVolunteer = event.volunteers.some(v => v.toString() === req.user.id);
      const isAdmin = req.user.role === 'admin';
      
      if (!isOrganizer && !isVolunteer && !isAdmin) {
        return res.status(401).json({ msg: 'Not authorized to mark attendance' });
      }
      
      // Mark attendance
      registration.attended = true;
      registration.attendanceTime = Date.now();
      
      await registration.save();
      
      res.json(registration);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/attendance/event/:eventId
// @desc    Get attendance for an event
// @access  Private (organizer, volunteer, admin)
router.get('/event/:eventId', 
  authenticate, 
  authorize('organizer', 'volunteer', 'admin'),
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.eventId);
      
      if (!event) {
        return res.status(404).json({ msg: 'Event not found' });
      }
      
      // Check if user is authorized to view attendance
      const isOrganizer = event.organizer.toString() === req.user.id;
      const isVolunteer = event.volunteers.some(v => v.toString() === req.user.id);
      const isAdmin = req.user.role === 'admin';
      
      if (!isOrganizer && !isVolunteer && !isAdmin) {
        return res.status(401).json({ msg: 'Not authorized to view attendance' });
      }
      
      // Get attendance data
      const registrations = await Registration.find({ event: req.params.eventId })
        .populate('participant', 'name email')
        .sort({ attendanceTime: -1 });
      
      const attended = registrations.filter(reg => reg.attended);
      const notAttended = registrations.filter(reg => !reg.attended);
      
      res.json({
        total: registrations.length,
        attended: attended.length,
        notAttended: notAttended.length,
        attendanceList: attended,
        absentList: notAttended
      });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Event not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;