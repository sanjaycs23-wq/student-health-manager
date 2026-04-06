const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

connectDB();

app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/health', require('./routes/healthRoutes'));

app.get('/', (req, res) => {
  res.send('Student Health API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

