import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import connectDB from './db/index.js';
import dotenv from 'dotenv';
import initializingPassport from './utils/passportConfig.js';
import passport from 'passport';
import { fileURLToPath } from 'url';
import path from 'path';

// Import routes
import authRouter from './routes/authRoutes.js';
import userDataRouter from './routes/userDataRoutes.js';


dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Configure CORS 
const allowedOrigins = [
  'http://localhost:3000',
  'https://assignment-project-frontend-cbs5.vercel.app' , // Add this origin
  process.env.ALLOWED_ORIGIN
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'src/public')));



//initializing passport
initializingPassport(passport);
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRouter);

app.use('/api/userData', userDataRouter)


connectDB()
  .then(() => {
    app.listen(5000, () => {
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
