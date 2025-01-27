import express from 'express';
import Truck from '../models/Truck.js';
import User from '../models/User.js';

const router = express.Router();

// Get all trucks with collector details
router.get('/', async (req, res) => {
    try {
      const trucks = await Truck.find().populate('collector', 'username email');
      res.json(trucks);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get truck by collector ID with collector details
  router.get('/collector/:collectorId', async (req, res) => {
    try {
      const truck = await Truck.findOne({ collector: req.params.collectorId })
        .populate('collector', 'username email');
      if (!truck) {
        return res.status(404).json({ message: 'No truck assigned' });
      }
      res.json(truck);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Assign collector to truck
  router.put('/:id/assign', async (req, res) => {
    try {
      const { collectorId } = req.body;
  
      // Verify collector exists
      const collector = await User.findOne({ 
        _id: collectorId,
        userType: 'collector'
      });
  
      if (!collector) {
        return res.status(404).json({ message: 'Collector not found' });
      }
  
      // Update truck
      const truck = await Truck.findByIdAndUpdate(
        req.params.id,
        { collector: collectorId },
        { new: true }
      ).populate('collector', 'username email');
  
      if (!truck) {
        return res.status(404).json({ message: 'Truck not found' });
      }
  
      res.json(truck);
    } catch (error) {
      console.error('Error assigning truck:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// Create new truck
router.post('/', async (req, res) => {
  try {
    const truck = new Truck(req.body);
    await truck.save();
    res.status(201).json(truck);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update truck location
router.put('/:id/location', async (req, res) => {
  try {
    const truck = await Truck.findByIdAndUpdate(
      req.params.id,
      { location: req.body.location },
      { new: true }
    );
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' });
    }
    res.json(truck);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign collector to truck
router.put('/:id/assign', async (req, res) => {
  try {
    const truck = await Truck.findByIdAndUpdate(
      req.params.id,
      { collector: req.body.collectorId },
      { new: true }
    );
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' });
    }
    res.json(truck);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const truck = await Truck.findByIdAndDelete(req.params.id);
    if (!truck) {
      return res.status(404).json({ message: 'Truck not found' });
    }
    res.json({ message: 'Truck removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;