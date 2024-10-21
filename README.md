# YelpCamp API

REST API for campgrounds application, built with Node.js, Express, and MongoDB.

## Technologies Used

| Technology                          | Purpose           |
| ----------------------------------- | ----------------- |
| [Express](http://expressjs.com/)    | Web framework     |
| [MongoDB](https://mongodb.com/)     | Database          |
| [Mongoose](https://mongoosejs.com/) | ODM               |
| [Passport](http://passportjs.org/)  | Authentication    |
| [Swagger](https://swagger.io/)      | API documentation |

## Endpoints

| Endpoint         | Description                              |
| ---------------- | ---------------------------------------- |
| `/healthz`       | Health check                             |
| `/api-docs`      | Swagger API documentation                |
| `/api-docs.json` | Swagger API documentation in JSON format |

### Auth

| Endpoint                | Description                  |
| ----------------------- | ---------------------------- |
| `POST /register`        | Register                     |
| `POST /login`           | Login                        |
| `POST /logout`          | Logout                       |
| `GET /getUser`          | Get the current session user |
| `DELETE /deleteAccount` | Delete account               |

### Campgrounds

| Endpoint                  | Description       |
| ------------------------- | ----------------- |
| `GET /campgrounds`        | Get campgrounds   |
| `POST /campgrounds`       | Create campground |
| `GET /campgrounds/:id`    | Get campground    |
| `PUT /campgrounds/:id`    | Update campground |
| `DELETE /campgrounds/:id` | Delete campground |

### Reviews

| Endpoint                                | Description   |
| --------------------------------------- | ------------- |
| `POST /campgrounds/:cid/reviews`        | Create review |
| `DELETE /campgrounds/:cid/reviews/:rId` | Delete review |

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

## Setup

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

| Script           | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| `npm run dev`    | Run the server in development mode (<http://localhost:3000>) |
| `npm run lint`   | Lint the code                                                |
| `npm run format` | Format the code using Prettier                               |
| `npm run build`  | Build the server for production mode                         |
| `npm run clean`  | Clean the build directory                                    |
| `npm start`      | Run the server in production mode                            |
| `npm run seed`   | Seed the database with sample data                           |

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
