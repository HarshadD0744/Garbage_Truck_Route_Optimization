import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import truckRoutes from './routes/trucks.js';
import binRoutes from './routes/bins.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/waste-management")
mongoose.connect("mongodb+srv://harshaddpt:Tharani_D@cluster0.drnnn.mongodb.net/SEM_5")
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes 
app.use('/api/auth', authRoutes);
app.use('/api/trucks', truckRoutes);
app.use('/api/bins', binRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});