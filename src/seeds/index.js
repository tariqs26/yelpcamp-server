import mongoose, { connect, set } from 'mongoose';
import Campground from '../models/campground.js';
import { cities } from './cities.js';
import { descriptors, places, descriptions } from './seedHelpers.js';

set('strictQuery', true);
connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 20; i++) {
    const randomCity = Math.floor(Math.random() * 494);
    const camp = new Campground({
      author: '63de3fd6cf2b890846c31672',
      location: `${cities[randomCity].city}, ${cities[randomCity].province}`,
      geometry: {
        type: 'Point',
        coordinates: [cities[randomCity].lng, cities[randomCity].lat],
      },
      title: `${sample(descriptors)} ${sample(places)}`,
      image:
        'https://images.unsplash.com/photo-1602391833977-358a52198938?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      description: sample(descriptions),
      price: Math.floor(Math.random() * 20) + 10,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
  console.log('Database disconnected');
});
