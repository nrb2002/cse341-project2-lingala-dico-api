require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');

const { connectDB } = require('./database/config'); //Get database info

const PORT = process.env.PORT || 3000;

//Import routes
const router = require('./routes');
const wordsRoutes = require('./routes/wordsRoutes');
const submissionsRoutes = require('./routes/submissionsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const swaggerRoutes = require('./routes/swaggerRoutes');


app.use(cors()); //controls origin access
app.use(express.json());

app.use('/', router); //Get default route
app.use('/v1/words', wordsRoutes); //Get words route
// app.use('/v1/submissions', submissionsRoutes); //Get words route
// app.use('/users', usersRoutes); //Get words route
app.use('/v1/api-docs', swaggerRoutes); //Get API documentation's route

//Connect to database
connectDB().then(() => {
  console.log('MongoDB connected, starting server...'); //For testing

  app.listen(PORT, () => {
    console.log(`Server running at port: ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});




app.use(require('./middleware/errorHandler'));
