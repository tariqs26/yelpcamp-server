import express from 'express';
import cors from 'cors';
import mongoose, { connect, set } from 'mongoose';
import MongoDBStore from 'connect-mongo';
import mongoSanitize from 'express-mongo-sanitize';
import session from 'express-session';
import ExpressError from './utils/ExpressError.js';
import passport from 'passport';
import passportLocal from 'passport-local';
import helmet from 'helmet';
import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') dotenv.config();

import campgroundRoutes from './routes/campgrounds.js';
import reviewRoutes from './routes/reviews.js';
import userRoutes from './routes/users.js';
import User from './models/user.js';

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(helmet());
app.use(mongoSanitize());

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60, // time period in seconds, after which the session will be updated in the database
});

store.on('error', function (e) {
  console.log('SESSION STORE ERROR', e);
});

app.use(
  session({
    store,
    name: 'apple touch icon',
    secret,
    resave: false,
    secure: true, // only set cookies over https
    saveUninitialized: true,
    cookie: {
      httpOnly: true, // prevents client side JS from reading the cookie
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(passport.initialize(), passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.all('*', (_, __, next) => {
  next(new ExpressError('Page not found', 404));
});

app.use((err, _, res, __) => {
  res.status(err.status || 500).send(err.message);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
