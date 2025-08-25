const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const Event = require('../models/Event');
const { authenticate, authorize } = require('../middleware/auth');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});


// @route   GET api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name email')
      .sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('volunteers', 'name email');
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/events
// @desc    Create a new event
// @access  Private (organizer, admin)
router.post('/', 
  authenticate, 
  authorize('organizer', 'admin'),
  upload.single('poster'),
  async (req, res) => {
    try {
      const { title, description, date, time, location, capacity } = req.body;

      const newEvent = new Event({
        title,
        description,
        date,
        time,
        location,
        capacity,
        organizer: req.user.id
      });

      if (req.file) {
        newEvent.poster = {
          fileName: req.file.filename,
          fileUrl: `/api/events/uploads/${req.file.filename}`,
          uploadedAt: new Date()
        };
      }

      const event = await newEvent.save();
      res.json(event);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/events/:id
// @desc    Update an event
// @access  Private (event organizer, admin)
router.put('/:id', 
  authenticate, 
  authorize('organizer', 'admin'),
  upload.single('poster'),
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      
      if (!event) {
        return res.status(404).json({ msg: 'Event not found' });
      }
      
      // Check if user is the organizer or an admin
      if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({ msg: 'Not authorized to update this event' });
      }
      
      // Update fields
      const { title, description, date, time, location, capacity } = req.body;
      if (title) event.title = title;
      if (description) event.description = description;
      if (date) event.date = date;
      if (time) event.time = time;
      if (location) event.location = location;
      if (capacity) event.capacity = capacity;
      
      // Update poster if uploaded
      if (req.file) {
  event.poster = {
    fileName: req.file.filename,
    fileUrl: `/api/events/uploads/${req.file.filename}`,
    uploadedAt: new Date()
  };
}
      
      await event.save();
      res.json(event);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Event not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE api/events/:id
// @desc    Delete an event
// @access  Private (event organizer, admin)
router.delete('/:id', 
  authenticate, 
  authorize('organizer', 'admin'),
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      
      if (!event) {
        return res.status(404).json({ msg: 'Event not found' });
      }
      
      // Check if user is the organizer or an admin
      if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({ msg: 'Not authorized to delete this event' });
      }
      
      await event.deleteOne();
      res.json({ msg: 'Event removed' });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Event not found' });
      }
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/events/:id/volunteers
// @desc    Add volunteers to an event
// @access  Private (event organizer, admin)
router.post('/:id/volunteers', 
  authenticate, 
  authorize('organizer', 'admin'),
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      
      if (!event) {
        return res.status(404).json({ msg: 'Event not found' });
      }
      
      // Check if user is the organizer or an admin
      if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({ msg: 'Not authorized to update this event' });
      }
      
      const { volunteers } = req.body;
      
      // Add volunteers to the event
      if (volunteers && Array.isArray(volunteers)) {
        event.volunteers = [...new Set([...event.volunteers, ...volunteers])];
        await event.save();
      }
      
      res.json(event);
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