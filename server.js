const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static('public'));

// Initialize data structure
const initData = {
  password: null, // Will be set on first use
  dailyLimit: 50, // grams per day
  fullBagWeight: 810, // grams
  emptyBagWeight: 10, // grams
  currentBagWeight: 810, // Start with full bag
  feedings: [] // Array of {date, weightBefore, weightAfter, amount}
};

// Load or create data file
async function loadData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with initial data
    await saveData(initData);
    return initData;
  }
}

async function saveData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get today's date as string (YYYY-MM-DD)
function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

// Calculate total eaten today
function getTodayFeedings(data) {
  const today = getTodayString();
  return data.feedings.filter(f => f.date === today);
}

// Authentication middleware
async function authenticate(req, res, next) {
  const { password } = req.body;
  const data = await loadData();
  
  if (!data.password) {
    // First time setup - any password will work and be stored
    if (!password) {
      return res.status(401).json({ error: 'Wachtwoord vereist' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    data.password = hashedPassword;
    await saveData(data);
    next();
  } else {
    // Verify password
    if (!password) {
      return res.status(401).json({ error: 'Wachtwoord vereist' });
    }
    const match = await bcrypt.compare(password, data.password);
    if (!match) {
      return res.status(401).json({ error: 'Onjuist wachtwoord' });
    }
    next();
  }
}

// API Routes

// Get current status
app.post('/api/status', authenticate, async (req, res) => {
  const data = await loadData();
  const todayFeedings = getTodayFeedings(data);
  const totalEaten = todayFeedings.reduce((sum, f) => sum + f.amount, 0);
  const remaining = data.dailyLimit - totalEaten;
  
  res.json({
    currentBagWeight: data.currentBagWeight,
    dailyLimit: data.dailyLimit,
    totalEatenToday: Math.round(totalEaten * 10) / 10,
    remainingToday: Math.round(remaining * 10) / 10,
    feedings: todayFeedings
  });
});

// Record a feeding
app.post('/api/feed', authenticate, async (req, res) => {
  const { weightBefore, weightAfter } = req.body;
  
  if (typeof weightBefore !== 'number' || typeof weightAfter !== 'number') {
    return res.status(400).json({ error: 'Gewichten moeten nummers zijn' });
  }
  
  if (weightBefore < weightAfter) {
    return res.status(400).json({ error: 'Gewicht na vullen kan niet hoger zijn dan ervoor' });
  }
  
  const data = await loadData();
  const amount = weightBefore - weightAfter;
  
  const feeding = {
    date: getTodayString(),
    timestamp: new Date().toISOString(),
    weightBefore,
    weightAfter,
    amount
  };
  
  data.feedings.push(feeding);
  data.currentBagWeight = weightAfter;
  await saveData(data);
  
  const todayFeedings = getTodayFeedings(data);
  const totalEaten = todayFeedings.reduce((sum, f) => sum + f.amount, 0);
  const remaining = data.dailyLimit - totalEaten;
  
  res.json({
    success: true,
    amount,
    totalEatenToday: Math.round(totalEaten * 10) / 10,
    remainingToday: Math.round(remaining * 10) / 10
  });
});

// Check if password is set
app.get('/api/check-password', async (req, res) => {
  const data = await loadData();
  res.json({ passwordSet: !!data.password });
});

app.listen(PORT, () => {
  console.log(`Kat-dieet server draait op http://localhost:${PORT}`);
});
