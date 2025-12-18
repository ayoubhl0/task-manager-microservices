const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(express.json());

// === CORS ===
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // frontend
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
}));

// === Proxies vers les microservices ===
app.use('/api/auth', createProxyMiddleware({
  target: 'http://localhost:3001', // auth-service local
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '' }
}));

app.use('/api/tasks', createProxyMiddleware({
  target: 'http://localhost:3002', // task-service local
  changeOrigin: true,
  pathRewrite: { '^/api/tasks': '' }
}));

app.use('/api/users', createProxyMiddleware({
  target: 'http://localhost:3003', // user-service local
  changeOrigin: true,
  pathRewrite: { '^/api/users': '' }
}));

app.use('/api/notifications', createProxyMiddleware({
  target: 'http://localhost:3004', // notification-service local
  changeOrigin: true,
  pathRewrite: { '^/api/notifications': '' }
}));

// === Route de test Gateway ===
app.get('/', (req, res) => {
  res.json({
    message: 'API Gateway is running!',
    endpoints: [
      '/api/auth/register - POST - Register user',
      '/api/auth/login - POST - Login user',
      '/api/tasks - POST - Create task',
      '/api/tasks/user/:userId - GET - Get user tasks'
    ]
  });
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// === Lancement du serveur ===
const PORT = 3005;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Gateway running on port ${PORT}`);
});
