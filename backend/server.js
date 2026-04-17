import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend build in production
if (NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendBuildPath));
  console.log(`📁 Serving frontend from: ${frontendBuildPath}`);
}

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hostel-ms';

mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ── SCHEMAS ───────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['admin', 'staff', 'student'] },
  rollNo: String,
  dept: String,
  roomId: String,
  feeStatus: String,
  createdAt: { type: Date, default: Date.now }
});

const roomSchema = new mongoose.Schema({
  id: String,
  blockCode: String,
  floor: Number,
  num: Number,
  ac: Boolean,
  price: Number,
  status: { type: String, enum: ['available', 'occupied', 'maintenance'] },
  studentId: String,
  createdAt: { type: Date, default: Date.now }
});

const paymentSchema = new mongoose.Schema({
  id: String,
  studentId: String,
  studentName: String,
  roomId: String,
  amount: Number,
  method: String,
  status: { type: String, enum: ['pending', 'success', 'failed'] },
  date: String,
  ref: String,
  purpose: String,
  createdAt: { type: Date, default: Date.now }
});

const complaintSchema = new mongoose.Schema({
  id: Number,
  studentId: String,
  studentName: String,
  roomId: String,
  category: String,
  description: String,
  status: { type: String, enum: ['pending', 'resolved'] },
  date: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Room = mongoose.model('Room', roomSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const Complaint = mongoose.model('Complaint', complaintSchema);

// ── ROUTES ───────────────────────────────────────────────────────────

// Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    // Update by custom 'id' field (not Mongo _id)
    const user = await User.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, upsert: false });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/rooms', async (req, res) => {
  try {
    console.log('POST /api/rooms payload:', req.body);
    const room = new Room(req.body);
    await room.save();
    console.log('Room saved:', room.id);
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/rooms/:id', async (req, res) => {
  try {
    // Update room by custom 'id' field
    console.log(`PUT /api/rooms/${req.params.id} payload:`, req.body);
    const room = await Room.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, upsert: false });
    console.log('Room updated:', req.params.id);
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/rooms/:id', async (req, res) => {
  try {
    console.log('DELETE /api/rooms/', req.params.id);
    await Room.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Payments
app.get('/api/payments', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/payments', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complaints
app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/complaints', async (req, res) => {
  try {
    const complaint = new Complaint(req.body);
    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/complaints/:id', async (req, res) => {
  try {
    // Update complaint by its numeric id field
    const complaint = await Complaint.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, upsert: false });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Serve index.html for all other routes (SPA fallback) in production
if (NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Environment: ${NODE_ENV}`);
});
