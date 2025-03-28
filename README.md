# YelpCamp API

RESTful API for [**YelpCamp**](https://github.com/tariqs26/yelpcamp-client), built with **Node.js**, **Express**, and **MongoDB**. The API supports creating, managing, and reviewing campgrounds.

## Technologies Used

| Technology                          | Purpose                                             |
| ----------------------------------- | --------------------------------------------------- |
| [Express](http://expressjs.com/)    | Web framework for routing and middleware management |
| [MongoDB](https://mongodb.com/)     | NoSQL database for scalable storage                 |
| [Mongoose](https://mongoosejs.com/) | ODM (Object-Document Mapping) for MongoDB           |
| [Passport](http://passportjs.org/)  | Authentication middleware                           |
| [Swagger](https://swagger.io/)      | API documentation and testing                       |

## Endpoints

**General:**

- `GET /healthz`: Health check to confirm server status
- `GET /api-docs`: Swagger API documentation
- `GET /api-docs.json`: JSON format of the Swagger API documentation

**Auth:**

- `POST /register`: Register a new user
- `POST /login`: Login and create a session
- `POST /logout`: Logout the current session
- `GET /getUser`: Get the authenticated user’s details
- `DELETE /deleteAccount`: Delete the authenticated user’s account

**Campgrounds:**

- `POST /campgrounds`: Create a new campground
- `GET /campgrounds`: Retrieve a list of all campgrounds
- `GET /campgrounds/:id`: Retrieve details of a specific campground
- `PUT /campgrounds/:id`: Update a specific campground
- `DELETE /campgrounds/:id`: Delete a specific campground

**Reviews:**

- `POST /campgrounds/:cid/reviews`: Create a review for a specific campground
- `DELETE /campgrounds/:cid/reviews/:rId`: Delete a review from a specific campground

## Data Models

The API uses the following Mongoose schemas to define the data models:

```ts
// Users
const UserSchema = new Schema({
  email: String,
  username: String,
  password: String,
  isAdmin: { type: Boolean, default: false, immutable: true },
})

// Campgrounds
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

// Reviews
const ReviewSchema = new Schema(
  {
    body: String,
    rating: Number,
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
)
```

## Setup

**1. Clone the repo**

```bash
git clone https://github.com/tariqs26/yelpcamp-server.git
cd yelpcamp-server
```

**2. Install dependencies**

```bash
npm i
```

**3. Configure environment variables**

Create a `.env` file in the root of your project with the following variables:

```bash
DB_URL=        # MongoDB connection string
SECRET=        # Secret used for signing session cookie
MAPBOX_TOKEN=  # Mapbox API token
CLIENT_ORIGIN= # Client URL, used for CORS configuration
# Note: To use a non-https origin, remove the `secure` option from the cookie session
```

**4. Start the development server**

```bash
npm run dev
```

## Available Scripts

| Script           | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| `npm run dev`    | Start the server in development mode (`http://localhost:3000`) |
| `npm run lint`   | Lint the codebase using Biome                                  |
| `npm run format` | Format the codebase using Prettier                             |
| `npm run build`  | Build the server for production                                |
| `npm start`      | Start the production server                                    |
| `npm run seed`   | Seed the database with sample data                             |
