import { Router } from 'express';
import userLoggedIn from '../middlewares/userLoggedIn.js';
import userAuthorized from '../middlewares/userAuthorized.js';
import validateCampground from '../middlewares/validateCampground.js';
import {
  index,
  getCampground,
  createCampground,
  updateCampground,
  deleteCampground,
} from '../controllers/campgrounds.js';
import catchAsync from '../utils/catchAsync.js';

const router = Router();

router
  .route('/')
  .get(catchAsync(index))
  .post(userLoggedIn, validateCampground, catchAsync(createCampground));

router
  .route('/:id')
  .get(catchAsync(getCampground))
  .put(
    userLoggedIn,
    userAuthorized,
    validateCampground,
    catchAsync(updateCampground)
  )
  .delete(userLoggedIn, userAuthorized, catchAsync(deleteCampground));

export default router;
