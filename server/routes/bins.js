import express from 'express';
import Bin from '../models/Bin.js';

const router = express.Router();

// Get all bins
router.get('/', async (req, res) => {
  try {
    const bins = await Bin.find();
    res.json(bins);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get nearby bins
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, range = 4 } = req.query;
    
    const bins = await Bin.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lat), parseFloat(lng)]
          },
          $maxDistance: range * 1000 // Convert km to meters
        }
      }
    });
    
    res.json(bins);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new bin
router.post('/', async (req, res) => {
  try {
    const bin = new Bin(req.body);
    await bin.save();
    res.status(201).json(bin);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update bin fullness
router.put('/:id/fullness', async (req, res) => {
  try {
    const bin = await Bin.findByIdAndUpdate(
      req.params.id,
      { fullness: req.body.fullness },
      { new: true }
    );
    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }
    res.json(bin);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete bin
router.delete('/:id', async (req, res) => {
  try {
    const bin = await Bin.findByIdAndDelete(req.params.id);
    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }
    res.json({ message: 'Bin removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;