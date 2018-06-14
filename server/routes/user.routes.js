import express from 'express';
import {isAuth} from '../middlewares/Auth';
import * as UserController from '../controllers/user.controllers';

const router = express.Router();

router.route('/:id')
  .get(isAuth, UserController.getUserById);

router.route('/:id/booking')
  .get(isAuth, UserController.getUserBooking);

export default router;
