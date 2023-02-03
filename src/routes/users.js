import { Router } from 'express';
import passport from 'passport';
import { register, login, logout, get } from '../controllers/users.js';
import catchAsync from '../utils/catchAsync.js';

const router = Router();

router.post('/register', catchAsync(register));

router.post('/login', passport.authenticate('local'), catchAsync(login));

router.get('/logout', logout);

router.get('/getUser', catchAsync(get));

export default router;
