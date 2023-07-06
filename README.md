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

```ts
const CampgroundSchema = new Schema(
  {
    title: String,
    description: String,
    location: String,
    price: Number,
    image: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
)
```

### Review:

```ts
const ReviewSchema = new Schema(
  {
    body: String,
    rating: Number,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
)
```

### User:

```ts
const UserSchema = new Schema({
  email: String,
  username: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false,
    immutable: true,
  },
})
```

## Technologies Used:

| Technology                                                                     | Purpose                        | Description                                                  |
| ------------------------------------------------------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| [Node.js](https://nodejs.org/en/)                                              | JavaScript runtime environment | Used for running the server                                  |
| [Nodemon](https://npmjs.com/package/nodemon)                                   | Development server             | Used for running the server in development                   |
| [Cors](https://npmjs.com/package/cors)                                         | Cross-origin resource sharing  | Used for allowing cross-origin requests                      |
| [Express](http://expressjs.com/)                                               | Web framework                  | Used for creating the RESTful API                            |
| [MongoDB](https://mongodb.com/)                                                | Database                       | NoSQL database, used for storing the data                    |
| [Mongoose](https://mongoosejs.com/)                                            | MongoDB object modeling        | ODM, used for the seamless creation of models                |
| [Zod](https://zod.dev/)                                                        | Validation Library             |
| [Dotenv](https://npmjs.com/package/dotenv)                                     | Environment variables          | Used for storing environment variables                       |
| [Passport](http://passportjs.org/)                                             | Authentication                 | Used for authentication                                      |
| [Express-Session](https://npmjs.com/package/express-session)                   | Session management             | Used for managing sessions                                   |
| [Helmet](https://helmetjs.github.io/)                                          | Security                       | Used for setting security-related HTTP headers               |
| [Express-Mongo-Sanitize](https://www.npmjs.com/package/express-mongo-sanitize) | Security                       | Used for sanitizing user input against NoSQL query injection |
| [Express-Rate-Limit](https://www.npmjs.com/package/express-rate-limit)         | Security                       | Used for limiting repeated requests to public APIs           |
| [Railway](https://railway.app/)                                                | Deployment                     | Used for deploying the server to the cloud                   |

## Getting Started:

`npm i` - Installs the dependencies

## Available Scripts:

| Script          | Description                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| `npm run dev`   | Runs the server in development mode, using nodemon to watch for file changes (http://localhost:3000) |
| `npm run build` | Builds the server for production mode                                                                |
| `npm start`     | Runs the server in production mode                                                                   |
| `npm run seed`  | Seeds the database with sample data                                                                  |

## Environment Variables:

```bash
DB_URL # MongoDB connection string, can be local or remote
SECRET # Secret used for signing the session cookie
MAPBOX_TOKEN # Mapbox API token, used for displaying the map on the frontend
CLIENT_ORIGIN # The origin of the client, used for CORS, can be local or remote
# Note: In order to use a non https origin, you need to remove the `secure` option from the cookie session
```
