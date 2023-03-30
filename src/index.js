import express from 'express';
import cors from 'cors';
import mongoose, { connect, set } from 'mongoose';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import MongoDBStore from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';
import passportLocal from 'passport-local';
import ExpressError from './utils/ExpressError.js';
import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') dotenv.config();

import campgroundRoutes from './routes/campgrounds.js';
import reviewRoutes from './routes/reviews.js';
import userRoutes from './routes/users.js';
import User from './models/user.js';

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

// Set up mongoose connection
set('strictQuery', true);
connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

// encoding incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up CORS
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(helmet()); // set security HTTP headers
app.use(mongoSanitize()); // prevent NoSQL injection

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

// Set up session store
const store = new MongoDBStore({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60, // time period in seconds, after which the session will be updated in the database
});

store.on('error', function (e) {
  console.log('SESSION STORE ERROR', e);
});
app.set('trust proxy', 1); // trust first proxy
// Set up session
app.use(
  session({
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    name: 'apple touch icon',
    cookie: {
      secure: true, // only set cookies over https (comment out when testing)
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'none', // (comment out when testing)
      httpOnly: false,
    },
  })
);

// Set up passport for authentication
app.use(passport.initialize(), passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

// Set up routes
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

// For routes that don't exist
app.all('*', (_, __, next) => {
  next(new ExpressError('Page not found', 404));
});

// Set up error handler
app.use((err, _, res, __) => {
  res.status(err.status || 500).send(err.message);
});

const port = process.env.PORT || 3000;

// Enable server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
