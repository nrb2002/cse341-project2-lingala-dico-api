require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db/connect');

const wordsRoutes = require('./routes/wordsRoutes');
const swaggerRoutes = require('./routes/swaggerRoutes');
const errorHandler = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3000;
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get(
  '/', 
  (req, res) => res.send('My Lingala Dico API is live!'));
app.use('/v1/words', wordsRoutes);
app.use('/v1/api-docs', swaggerRoutes);

// Centralized error handler 
app.use(errorHandler);

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    console.log('MongoDB connected, starting server...');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // exit if DB fails
  });
