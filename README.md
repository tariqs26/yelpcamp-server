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

## Data Models

### Campground:

```js
const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
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

## Abstractions:

| Technology | Purpose                        | Description                                                      |
| ---------- | ------------------------------ | ---------------------------------------------------------------- |
| Node.js    | JavaScript runtime environment | Used for running the server                                      |
| Nodemon    | Development server             | Used for running the server in development                       |
| Express    | Web framework                  | Used for creating the RESTful API                                |
| MongoDB    | Database                       | NoSQL database, used for storing the data                        |
| Mongoose   | MongoDB object modeling        | ODM, used for the seamless creation of models                    |
| Joi        | Object schema validation       | Server-side validation, used for validating the body of requests |

## References:

- [Express](http://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Cors](https://www.npmjs.com/package/cors)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Morgan](https://www.npmjs.com/package/morgan)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [Joi](https://www.npmjs.com/package/joi)
