import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import connectDB from './db/index.js';
import dotenv from 'dotenv';
import initializingPassport from './utils/passportConfig.js';
import passport from 'passport';
import session from 'express-session';



dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// Import routes
import authRouter from './routes/authRoutes.js';
import userDataRouter from './routes/userDataRoutes.js';


// Configure CORS 
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies and credentials
}));


// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



//initializing passport
initializingPassport(passport);
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRouter);

app.use('/api/userData', userDataRouter)


connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port: ${port}!`);
    });

    app.on('error', (error) => {
      console.error('Server error:', error);
    })
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });



;

export default app;
