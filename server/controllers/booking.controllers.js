import * as BookingServices from '../services/booking.services';
import {isValidRoomType} from "../services/roomType.services";
import {isValidDate} from "../utils/DateTimeHelper";
import {BOOKING_LIMIT} from "../services/booking.services";
import {isObjectId} from "../utils/StringHelper";

export async function addBooking(req, res) {
  try {
    let roomTypeId = req.body.type;
    if(!isValidRoomType(roomTypeId)) {
      return res.status(400).json({success: false, error: 'Invalid room type'});
    }

    let quantity = Number(req.body.quantity).valueOf();
    if(isNaN(quantity)) {
      return res.status(400).json({success: false, error: 'Invalid quantity'});
    }

    let start_date = new Date( Number(req.body.start).valueOf() );
    if(!isValidDate(start_date)) {
      return res.status(400).json({success: false, error: 'Invalid start date'});
    }

    let end_date = new Date( Number(req.body.end).valueOf() );
    if(!isValidDate(end_date)) {
      return res.status(400).json({success: false, error: 'Invalid end date'});
    }

    let data = await BookingServices.bookRoom(req.user._id, roomTypeId, quantity, start_date, end_date);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    err.success = false;
    err.error = err.error || 'Internal error.';
    return res.status(err.status || 500).json(err);
  }
}

export async function searchBooking(req, res) {
  try {
    let page = Number(req.query.page || 1).valueOf();
    let uniqueCode = req.query.code, idNumber = req.query.idNumber;

    let data = await BookingServices.searchBooking(page, uniqueCode, idNumber);
    data.success = true;
    data.current_page = page;
    data.last_page = Math.ceil(data.total_items / BOOKING_LIMIT);

    return res.status(200).json(data);
  } catch (err) {
    err.success = false;
    err.error = err.error || 'Internal error.';
    return res.status(err.status || 500).json(err);
  }
}

export async function cancelBooking(req, res) {
  try {
    let bookingId = req.params.id;
    if(!isObjectId(bookingId)) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found.'
      });
    }

    let data = await BookingServices.cancelBooking(req.user, bookingId);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    err.success = false;
    err.error = err.error || 'Internal error.';
    return res.status(err.status || 500).json(err);
  }
}

export async function editBooking(req, res) {
  try {
    let bookingId = req.params.id;
    let reqUser = req.user;

    if(!isObjectId(bookingId)) {
      return res.status(404).json({success: false, error: 'Booking not found'});
    }

    let bookingOptions = {};

    let roomId = req.body.room;
    if(isObjectId(roomId)) {
      bookingOptions.room = roomId;
    }

    let start_date = new Date( Number(req.body.start).valueOf() );
    if(isValidDate(start_date)) {
      bookingOptions.start_date = start_date;
    }

    let end_date = new Date( Number(req.body.end).valueOf() );
    if(isValidDate(end_date)) {
      bookingOptions.end_date = end_date;
    }

    let data = await BookingServices.editBooking(bookingId, bookingOptions, reqUser);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    err.success = false;
    err.error = err.error || 'Internal error.';
    return res.status(err.status || 500).json(err);
  }
}
