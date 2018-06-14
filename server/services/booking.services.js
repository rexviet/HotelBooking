import Booking from '../models/booking';
import {getRooms, formatBasicInfo as formatBasicRoomInfo} from "./room.services";
import {generateUniqueCode} from "../utils/StringHelper";
import {getUserIdNumber, formatBasicInfo as formatBasicUserInfo} from "./user.services";
import {toObjectByKey} from "../utils/ArrayHelper";
import {getRoomTypePrice} from "./roomType.services";

export const BOOKING_LIMIT = 2;

export async function getBookingInTimeRange(start_date, end_date) {
  try {
    return await Booking.find({
      '$or': [
        {start_date: {$gte: start_date, $lte: end_date}},
        {end_date: {$gte: start_date, $lte: end_date}},
      ]
    }, 'room').lean();
  } catch (err) {
    console.log('err on getBookingInTimeRange:', err);
    return Promise.reject({status: 500, error: 'Internal error.'});
  }
}

export async function bookRoom(userId, roomTypeId, quantity, start_date, end_date) {
  try {
    let resources = await Promise.all([
      getRooms(start_date, end_date, roomTypeId, quantity),
      getUserIdNumber(userId),
      getRoomTypePrice(roomTypeId)
    ]);
    let rooms = resources[0], idNumber = resources[1], price = resources[2];
    if(rooms.length < quantity) {
      return Promise.reject({status: 400, error: 'Not enough room.'});
    }

    let bookingPromises = rooms.map(async room => {
      return await new Booking({
        uniqueCode: await generateCode(),
        idNumber,
        price,
        user: userId,
        room: room._id,
        start_date,
        end_date
      }).save();
    });

    let booking = await Promise.all(bookingPromises);
    return await formatData(booking);
  } catch (err) {
    console.log('err on bookRoom:', err);
    return Promise.reject({status: 500, error: 'Internal error.'});
  }
}

export async function generateCode() {
  try {
    let booking = await Booking.find({}, 'uniqueCode').lean();
    let existCodes = booking.map(book => book.uniqueCode);
    let code;

    do {
      code = generateUniqueCode(6);
    } while (existCodes.indexOf(code) >= 0);

    return code;
  } catch (err) {
    console.log('err on generateUniqueCode:', err);
    return Promise.reject({status: 500, error: 'Internal error.'});
  }
}

export async function searchBooking(page, uniqueCode, userIdNumber) {
  try {
    let skip = (page - 1) * BOOKING_LIMIT;
    let conditions = {};
    if(uniqueCode) {
      conditions.uniqueCode = {$regex: '.*' + uniqueCode + '.*'};
    }
    if(userIdNumber) {
      conditions.idNumber = {$regex: '.*' + userIdNumber + '.*'};
    }

    let results = await Promise.all([
      Booking.count(conditions),
      Booking.find(conditions).sort({start_date: 1}).skip(skip).limit(BOOKING_LIMIT).lean()
    ]);
    let total_items = results[0], data = await formatData(results[1], true);

    return {
      total_items,
      data
    };
  } catch (err) {
    console.log('err on searchBooking:', err);
    return Promise.reject({status: 500, error: 'Internal error.'});
  }
}

async function formatData(bookingModels, formatUser) {
  try {
    if(!(bookingModels instanceof Array)) {
      bookingModels = [bookingModels];
    }
    bookingModels = JSON.parse(JSON.stringify(bookingModels));

    let userIds = [], roomIds = [];
    bookingModels.forEach(booking => {
      userIds.push(booking.user);
      roomIds.push(booking.room);
    });

    let resources = await Promise.all([
      formatBasicUserInfo(userIds),
      formatBasicRoomInfo(roomIds)
    ]);
    let userMapper = toObjectByKey(resources[0], '_id');
    let roomMapper = toObjectByKey(resources[1], '_id');

    return bookingModels.map(booking => {
      booking.user = formatUser ? userMapper[booking.user] : booking.user;
      booking.room = roomMapper[booking.room];

      return booking;
    });
  } catch (err) {
    console.log('err on searchBooking:', err);
    return Promise.reject({status: err.status || 500, error:  err.error || 'Internal error.'});
  }
}

export async function getUserBooking(userId, page) {
  try {
    let skip = (page - 1) * BOOKING_LIMIT;
    let conditions = {
      user: userId
    };

    let results = await Promise.all([
      Booking.count(conditions),
      Booking.find(conditions).sort({start_date: 1}).skip(skip).limit(BOOKING_LIMIT).lean()
    ]);
    let total_items = results[0], data = await formatData(results[1]), last_page = Math.ceil(total_items / BOOKING_LIMIT);

    return {
      total_items,
      data,
      last_page
    };
  } catch (err) {
    console.log('err on getUserBooking:', err);
    return Promise.reject({status: err.status || 500, error:  err.error || 'Internal error.'});
  }
}
