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
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      author: '63d399532d1576726913e3e1',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      title: `${sample(descriptors)} ${sample(places)}`,
      image: 'https://source.unsplash.com/collection/483251/1600x900',
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
