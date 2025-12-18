const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// ALWAYS FIRST
app.use(express.json());

// Configuration
const MONGO_URI = 'mongodb://127.0.0.1:27017/auth_service';
const JWT_SECRET = 'secret-key-change-in-production';
const PORT = 3001;

// =============== CORS ==================
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowed = ['http://localhost:3000', 'http://localhost:3005', 'http://localhost:5173'];

  if (allowed.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ============== LOGGER ==================
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("📝 Body:", req.body);
  next();
});

// ============= MONGODB ==================
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch(err => console.log("❌ MongoDB ERROR:", err));

// ============= USER MODEL ================
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);

// ============= REGISTER ==================
app.post("/register", async (req, res) => {
  try {
    console.log("📝 Requête d'inscription reçue:", req.body);

    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ error: "Tous les champs sont requis" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ error: "Email déjà utilisé" });

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({
      message: "Utilisateur créé",
      user: { id: user._id, username, email }
    });

  } catch (err) {
    console.error("❌ Erreur d'inscription:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// ============= LOGIN ==================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email et mot de passe obligatoires" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Identifiants incorrects" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Mot de passe incorrect" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "24h" });

    res.json({
      message: "Connexion réussie",
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// ============ START SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 Auth service running on http://localhost:${PORT}`);
});
