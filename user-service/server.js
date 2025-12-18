const express = require('express');

const app = express();
app.use(express.json());

// Base de données en mémoire (simplifiée)
const users = [
  { 
    id: 1, 
    username: 'testuser', 
    email: 'test@example.com', 
    profile: { firstName: 'Test', lastName: 'User' } 
  }
];

// Récupérer le profil utilisateur
app.get('/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const user = users.find(u => u.id == userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      profile: user.profile
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'User Service is running' });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
