const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task');

const app = express();

// === CORS ===
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3005'],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
}));
app.options('*', (req, res) => res.sendStatus(200));

// === Body parser avec limite augmentée ===
app.use(express.json({ limit: '10mb' }));

// === Connexion MongoDB ===
mongoose.connect('mongodb://127.0.0.1:27017/taske')
  .then(() => console.log('✅ MongoDB connecté à la base "taske"'))
  .catch(err => console.error('❌ MongoDB ERROR:', err));

// === Routes ===
// Créer une tâche
app.post('/', async (req, res) => {
  try {
    const { title, description, user_id } = req.body;
    if (!title || !user_id) return res.status(400).json({ error: 'Title and user_id are required' });

    const task = new Task({ title, description, user_id });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Récupérer les tâches d'un utilisateur
app.get('/user/:userId', async (req, res) => {
  try {
    const userTasks = await Task.find({ user_id: req.params.userId });
    res.json(userTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route test
app.get('/', async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    res.json({ message: 'Task Service is running', totalTasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(3002, () => console.log('Task service running on port 3002'));
