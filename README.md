# YelpCamp RESTful API

## API Endpoints

### Campgrounds:

- `GET /campgrounds` - returns all the campgrounds
- `GET /campgrounds/:id` - returns a single campground
- `POST /campgrounds` - creates a new campground
- `PUT /campgrounds/:id` - updates a campground
- `DELETE /campgrounds/:id` - deletes a campground

### Reviews:

- `POST /campgrounds/:id/reviews` - creates a new review for a campground
- `DELETE /campgrounds/:id/reviews/:reviewId` - deletes a review for a campground

### Users:

- `POST /register` - registers a new user
- `POST /login` - logs in a user
- `GET /logout` - logs out a user
- `GET /getUser` - returns the current user in the session

## Data Models

### Campground:

```js
const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});
```

#### Server-side Validation:

```js
const campgroundSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required().min(0),
  image: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
});
```

### Review:

```js
const ReviewSchema = new Schema({
  rating: Number,
  text: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});
```

#### Server-side Validation:

```js
const reviewSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  text: Joi.string().required(),
});
```

### User:

```js
const UserSchema = new Schema({
  email: String,
  username: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false,
    immutable: true,
  },
});
```

#### Server-side Validation:

```js
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required().min(3).max(20),
  password: Joi.string().required().min(8).max(20),
});
```

## Technologies Used:

| Technology                                                                     | Purpose                        | Description                                                      |
| ------------------------------------------------------------------------------ | ------------------------------ | ---------------------------------------------------------------- |
| [Node.js](https://nodejs.org/en/)                                              | JavaScript runtime environment | Used for running the server                                      |
| [Nodemon](https://npmjs.com/package/nodemon)                                   | Development server             | Used for running the server in development                       |
| [Cors](https://npmjs.com/package/cors)                                         | Cross-origin resource sharing  | Used for allowing cross-origin requests                          |
| [Express](http://expressjs.com/)                                               | Web framework                  | Used for creating the RESTful API                                |
| [MongoDB](https://mongodb.com/)                                                | Database                       | NoSQL database, used for storing the data                        |
| [Mongoose](https://mongoosejs.com/)                                            | MongoDB object modeling        | ODM, used for the seamless creation of models                    |
| [Joi](https://npmjs.com/package/joi)                                           | Object schema validation       | Server-side validation, used for validating the body of requests |
| [Dotenv](https://npmjs.com/package/dotenv)                                     | Environment variables          | Used for storing environment variables                           |
| [Passport](http://passportjs.org/)                                             | Authentication                 | Used for authentication                                          |
| [Express-Session](https://npmjs.com/package/express-session)                   | Session management             | Used for managing sessions                                       |
| [Helmet](https://helmetjs.github.io/)                                          | Security                       | Used for setting security-related HTTP headers                   |
| [Express-Mongo-Sanitize](https://www.npmjs.com/package/express-mongo-sanitize) | Security                       | Used for sanitizing user input against NoSQL query injection     |

## Installation:

### `npm install`

- Installs all the dependencies

## Available Scripts:

- In the project directory, you can run:

### `npm run dev`

- spin up the server in development mode, using nodemon

### `npm start`

- spin up the server in production mode

### `npm run seed`

- seed the database with sample data
- **Note:** This will delete all the existing data in the database

## Environment Variables:

- `DB_URL` - MongoDB connection string, can be local or remote
- `SECRET` - Secret used for signing the session cookie 
- `MAPBOX_TOKEN` - Mapbox API token, used for displaying the map on the frontend
- `CLIENT_ORIGIN` - The origin of the client, used for CORS, can be local or remote
- **Note**: In order to use a non https origin, you need to remove the `secure` option from the cookie session
