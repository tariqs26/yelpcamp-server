import dotenv from "dotenv";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";
import ExpressError from "../utils/ExpressError.js";
import Campground from "../models/campground.js";

if (process.env.NODE_ENV !== "production") dotenv.config();

const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

export default class CampgroundsController {
  async getCampgrounds(req, res) {
    const { page = 1 } = req.query;
    const MAX_CAMPGROUNDS = 5;
    res.send({
      campgrounds: await Campground.find({})
        .sort({ createdAt: -1 })
        .skip((page - 1) * MAX_CAMPGROUNDS)
        .limit(MAX_CAMPGROUNDS),
      totalPages: Math.ceil(
        (await Campground.countDocuments()) / MAX_CAMPGROUNDS
      ),
    });
  }

  async getCampgroundById(req, res) {
    const { id } = req.params;
    try {
      const campground = await Campground.findById(id);
      const populateReviews = await campground.populate({
        path: "reviews",
        populate: { path: "author" },
      });
      const populateAuthor = await populateReviews.populate("author");

      res.send(populateAuthor);
    } catch (e) {
      throw new ExpressError("Campground not found", 404);
    }
  }

  async createCampground(req, res) {
    const geoData = await geocoder
      .forwardGeocode({
        query: req.body.location,
      })
      .send();
    const campground = new Campground(req.body);
    if (!geoData.body.features[0])
      throw new ExpressError("Location not found", 404);

    campground.geometry = geoData.body.features[0].geometry;
    campground.author = req.user._id;
    await campground.save();
    res.send(campground);
  }

  async updateCampground(req, res) {
    const { id } = req.params;
    const geoData = await geocoder
      .forwardGeocode({
        query: req.body.location,
      })
      .send();
    req.body.geometry = geoData.body.features[0].geometry;
    await Campground.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    res.send("Campground updated");
  }

  async deleteCampground(req, res) {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.send("Campground deleted");
  }
}
