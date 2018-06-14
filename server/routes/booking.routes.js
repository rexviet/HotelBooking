import express from 'express';
import {isAuth, isAdmin} from '../middlewares/Auth';
import * as BookingController from '../controllers/booking.controllers';

const router = express.Router();

router.route('/')
  .get(isAdmin, BookingController.searchBooking)
  .post(isAuth, BookingController.addBooking);


export default router;
