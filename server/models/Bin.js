import mongoose from 'mongoose';

const binSchema = new mongoose.Schema({
  binId: {
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
  fullness: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

binSchema.index({ location: '2dsphere' });

export default mongoose.model('Bin', binSchema);