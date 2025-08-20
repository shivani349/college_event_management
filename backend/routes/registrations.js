const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { authenticate } = require('../middleware/auth');

// @route   POST api/registrations
// @desc    Register for an event
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { eventId } = req.body;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      event: eventId,
      participant: req.user.id
    });
    
    if (existingRegistration) {
      return res.status(400).json({ msg: 'Already registered for this event' });
    }
    
    // Check if event is at capacity
    const registrationCount = await Registration.countDocuments({ event: eventId });
    if (registrationCount >= event.capacity) {
      return res.status(400).json({ msg: 'Event is at full capacity' });
    }
    
    // Generate unique registration ID
    const registrationId = `${eventId}-${req.user.id}-${Date.now()}`;
    
    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(registrationId);
    
    // Create registration
    const registration = new Registration({
      event: eventId,
      participant: req.user.id,
      qrCode: qrCodeDataURL
    });
    
    await registration.save();
    
    res.json(registration);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/registrations/user
// @desc    Get all registrations for current user
// @access  Private
router.get('/user', authenticate, async (req, res) => {
  try {
    const registrations = await Registration.find({ participant: req.user.id })
      .populate('event', 'title date time location')
      .sort({ registrationDate: -1 });
    
    res.json(registrations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/registrations/event/:eventId
// @desc    Get all registrations for an event
// @access  Private (organizer, volunteer, admin)
router.get('/event/:eventId', authenticate, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    // Check if user is authorized to view registrations
    const isOrganizer = event.organizer.toString() === req.user.id;
    const isVolunteer = event.volunteers.some(v => v.toString() === req.user.id);
    const isAdmin = req.user.role === 'admin';
    
    if (!isOrganizer && !isVolunteer && !isAdmin) {
      return res.status(401).json({ msg: 'Not authorized to view registrations' });
    }
    
    const registrations = await Registration.find({ event: req.params.eventId })
      .populate('participant', 'name email')
      .sort({ registrationDate: -1 });
    
    res.json(registrations);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/registrations/count/:eventId
// @desc    Get registration count for an event
// @access  Public
router.get('/count/:eventId', async (req, res) => {
  try {
    const count = await Registration.countDocuments({ event: req.params.eventId });
    res.json({ count });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;