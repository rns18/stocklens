const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'stocklens_secret_key_2026';

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool Setup
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'stocklens',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware for JWT Authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

// Register User
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO USERS (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username or Email already exists' });
    }
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const [users] = await pool.query('SELECT * FROM USERS WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user.user_id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.user_id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// ============================================================================
// STOCKS & MARKET ENDPOINTS
// ============================================================================

// Get all stocks with their performance analytics (Uses View: v_stock_analytics)
app.get('/api/stocks', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM v_stock_analytics');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve stock list', details: error.message });
  }
});

// Get detailed info for a single stock
app.get('/api/stocks/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM v_stock_analytics WHERE stock_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Stock not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Database query failed', details: error.message });
  }
});

// Get price history for a stock (Time-series data for charting)
app.get('/api/stocks/:id/history', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT price_date, open_price, high_price, low_price, closing_price FROM PRICE_HISTORY WHERE stock_id = ? ORDER BY price_date ASC',
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch price history', details: error.message });
  }
});

// ============================================================================
// PORTFOLIO ENDPOINTS (Authenticated)
// ============================================================================

// Get user's current portfolio details (Uses View: v_portfolio_details)
app.get('/api/portfolio', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM v_portfolio_details WHERE user_id = ?', [req.user.userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve portfolio details', details: error.message });
  }
});

// Add stock position to portfolio (Calls Stored Procedure: PurchaseStock)
app.post('/api/portfolio/buy', authenticateToken, async (req, res) => {
  const { ticker, shares, buyPrice, investDate } = req.body;
  if (!ticker || !shares || !buyPrice || !investDate) {
    return res.status(400).json({ error: 'Missing purchase details' });
  }

  try {
    // Call the PurchaseStock stored procedure
    const [result] = await pool.query(
      'CALL PurchaseStock(?, ?, ?, ?, ?, @status_message)',
      [req.user.userId, ticker, shares, buyPrice, investDate]
    );
    
    // Retrieve the status message from session variables
    const [[statusRow]] = await pool.query('SELECT @status_message AS status');
    
    if (statusRow.status && statusRow.status.startsWith('ERROR')) {
      return res.status(400).json({ error: statusRow.status });
    }
    
    res.json({ message: statusRow.status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete transaction', details: error.message });
  }
});

// Delete portfolio position
app.delete('/api/portfolio/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM PORTFOLIO WHERE portfolio_id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Position not found or unauthorized' });
    }

    res.json({ message: 'Portfolio position removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete position', details: error.message });
  }
});

// ============================================================================
// ANALYTICS & CALCULATION ENDPOINTS
// ============================================================================

// Get moving average for a stock (Calls Stored Procedure: GetStockMovingAverage)
app.get('/api/analytics/moving-average/:stockId/:days', async (req, res) => {
  const { stockId, days } = req.params;
  try {
    await pool.query('CALL GetStockMovingAverage(?, ?, @moving_avg)', [stockId, days]);
    const [[result]] = await pool.query('SELECT @moving_avg AS movingAverage');
    res.json({ stockId, days, movingAverage: result.movingAverage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate moving average', details: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`StockLens API Server is running on port ${PORT}`);
});
