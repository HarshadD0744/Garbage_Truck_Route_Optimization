import mongoose from 'mongoose';

const truckSchema = new mongoose.Schema({
  truckId: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  capacity: {
    type: Number,
    required: true
  },
  currentLoad: {
    type: Number,
    default: 0
  },
  range: {
    type: Number,
    default: 4
  },
  collector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

truckSchema.index({ location: '2dsphere' });

export default mongoose.model('Truck', truckSchema);