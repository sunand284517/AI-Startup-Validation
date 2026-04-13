// backend/models/Idea.js
const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  rating: Number,
  suggestions: String,
  createdAt: { type: Date, default: Date.now }
});

const PollSchema = new mongoose.Schema({
  question: String,
  options: [String],
  votes: { type: Map, of: Number }, // keys: option index as string "0", "1", values = count
  createdAt: { type: Date, default: Date.now }
});

const ApplicationSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  role: String,
  message: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const IdeaSchema = new mongoose.Schema({
  title: String,
  problem: String,
  solution: String,
  userId: String,
  userName: String,
  userPhoto: String,
  category: String,
  qualityScore: Number,
  aiFeedback: mongoose.Schema.Types.Mixed,
  status: { type: String, default: 'published' },
  feedback: [FeedbackSchema],
  polls: [PollSchema],
  applications: [ApplicationSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Idea', IdeaSchema);
