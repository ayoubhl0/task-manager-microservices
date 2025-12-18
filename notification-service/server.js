const express = require('express');
const WebSocket = require('ws');

const app = express();
app.use(express.json());

// Base de données en mémoire (simplifiée)
const notifications = [];

// Envoyer une notification
app.post('/notify', (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    const notification = {
      id: notifications.length + 1,
      userId,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };

    notifications.push(notification);

    res.json({
      success: true,
      message: 'Notification sent',
      notification
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Route de test
app.get('/', (req, res) => {
  res.json({
    message: 'Notification Service is running',
    totalNotifications: notifications.length
  });
});

const PORT = 3004;
const server = app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to Notification Service'
  }));

  ws.on('message', (message) => {
    console.log('Received:', message.toString());
  });
});
