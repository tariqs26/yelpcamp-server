# YelpCamp API

REST API for campgrounds application, built with Node.js, Express, MongoDB and Mongoose.

## Technologies Used

| Technology                                                                     | Purpose                               |
| ------------------------------------------------------------------------------ | ------------------------------------- |
| [Express](http://expressjs.com/)                                               | Web framework                         |
| [Cors](https://npmjs.com/package/cors)                                         | Cross-origin resource sharing         |
| [Nodemon](https://npmjs.com/package/nodemon)                                   | Development server                    |
| [MongoDB](https://mongodb.com/)                                                | Database                              |
| [Mongoose](https://mongoosejs.com/)                                            | ODM                                   |
| [Zod](https://zod.dev/)                                                        | Validation Library                    |
| [Dotenv](https://npmjs.com/package/dotenv)                                     | Environment variables                 |
| [Passport](http://passportjs.org/)                                             | Authentication                        |
| [Express-Session](https://npmjs.com/package/express-session)                   | Session management                    |
| [Helmet](https://helmetjs.github.io/)                                          | Setting security-related HTTP headers |
| [Express-Mongo-Sanitize](https://www.npmjs.com/package/express-mongo-sanitize) | Preventing NoSQL injections           |
| [Express-Rate-Limit](https://www.npmjs.com/package/express-rate-limit)         | Rate limiting                         |
| [Swagger](https://swagger.io/)                                                 | API documentation                     |

## Documentation

API documentation is available at [https://yc-server8080.onrender.com/api-docs](https://yc-server8080.onrender.com/api-docs)

## Endpoints

### Campgrounds

| Endpoint                  | Description             |
| ------------------------- | ----------------------- |
| `GET /campgrounds`        | return campgrounds      |
| `POST /campgrounds`       | create campground       |
| `GET /campgrounds/:id`    | return campground by id |
| `PUT /campgrounds/:id`    | update campground by id |
| `DELETE /campgrounds/:id` | delete campground by id |

### Reviews

| Endpoint                                | Description                          |
| --------------------------------------- | ------------------------------------ |
| `POST /campgrounds/:cid/reviews`        | create review for a campground       |
| `DELETE /campgrounds/:cid/reviews/:rId` | delete review for a campground by id |

### Users

| Endpoint         | Description                        |
| ---------------- | ---------------------------------- |
| `POST /register` | register a user                    |
| `POST /login`    | login a user                       |
| `POST /logout`   | logout a user                      |
| `GET /getUser`   | return current user in the session |

## Data Models

### Campground

```ts
const CampgroundSchema = new Schema(
  {
    title: String,
    description: String,
    location: String,
    price: Number,
    image: String,
    geometry: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
)
```

### Review

```ts
const ReviewSchema = new Schema(
  {
    body: String,
    rating: Number,
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
)
```

### User

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

## Installation

### Install dependencies

```bash
npm i
```

### Configure environment variables

```bash
DB_URL=        # MongoDB connection string
SECRET=        # Secret used for signing session cookie
MAPBOX_TOKEN=  # Mapbox API token
CLIENT_ORIGIN= # Client url, used for CORS
# Note: To use a non-https origin,remove the `secure` option from the cookie session
```

## Available Scripts

| Script          | Description                                                |
| --------------- | ---------------------------------------------------------- |
| `npm run dev`   | Run the server in development mode (http://localhost:3000) |
| `npm run build` | Build the server for production mode                       |
| `npm run clean` | Clean the build directory                                  |
| `npm start`     | Run the server in production mode                          |
| `npm run seed`  | Seed the database with sample data                         |

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
