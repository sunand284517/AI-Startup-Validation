const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Idea = require('./models/Idea');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ideaspark')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Ideas Routes
app.get('/api/ideas', async (req, res) => {
    const { category } = req.query;
    let filter = { status: 'published' };
    if (category && category !== 'all') {
        filter.category = category;
    }
    const ideas = await Idea.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json(ideas);
});

app.post('/api/ideas', async (req, res) => {
    const idea = new Idea({ ...req.body, status: 'published', createdAt: new Date() });
    await idea.save();
    res.json(idea);
});

app.post('/api/ideas/:id/feedback', async (req, res) => {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).send('Idea not found');
    idea.feedback.push({ ...req.body, createdAt: new Date() });
    await idea.save();
    // Return the updated feedback array
    res.json(idea.feedback);
});

app.get('/api/ideas/:id/feedback', async (req, res) => {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).send('Idea not found');
    const feedback = idea.feedback.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(feedback);
});

app.post('/api/ideas/:id/polls', async (req, res) => {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).send('Idea not found');
    const { question, options } = req.body;
    const votes = {};
    options.forEach((_, i) => votes[i] = 0); // initialize votes tracker
    idea.polls.push({ question, options, votes, createdAt: new Date() });
    await idea.save();
    res.json(idea.polls);
});

app.get('/api/ideas/:id/polls', async (req, res) => {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).send('Idea not found');
    res.json(idea.polls);
});

app.post('/api/ideas/:id/polls/:pollId/vote', async (req, res) => {
    const idea = await Idea.findById(req.params.id);
    const { optionIndex } = req.body;
    const poll = idea.polls.id(req.params.pollId);
    if (poll) {
        poll.votes.set(optionIndex.toString(), (poll.votes.get(optionIndex.toString()) || 0) + 1);
        idea.markModified('polls');
        await idea.save();
    }
    res.json(idea.polls);
});

app.post('/api/ideas/:id/applications', async (req, res) => {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).send('Idea not found');
    idea.applications.push({ ...req.body, createdAt: new Date() });
    await idea.save();
    res.json(idea.applications);
});

app.get('/api/ideas/:id/applications', async (req, res) => {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).send('Idea not found');
    res.json(idea.applications);
});

app.post('/api/auth/login', async (req, res) => {
    // Mock login simulating Google Auth callback
    const { email, displayName, photoURL } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
        const uid = 'uid_' + Date.now().toString();
        user = new User({
            uid,
            email,
            displayName: displayName || email.split('@')[0],
            photoURL: photoURL || '',
            session: { isActive: false }
        });
        await user.save();
    }
    res.json({ token: 'mock-jwt-token', user });
});

app.get('/api/users/:uid', async (req, res) => {
    const user = await User.findOne({ uid: req.params.uid });
    res.json(user);
});

app.patch('/api/users/:uid/session', async (req, res) => {
    const user = await User.findOneAndUpdate(
        { uid: req.params.uid },
        { session: req.body.session },
        { new: true }
    );
    res.json(user);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


