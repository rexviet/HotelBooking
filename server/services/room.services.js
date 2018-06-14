import Rooms from '../models/rooms';
import {getBookingInTimeRange} from "./booking.services";
import {groupByKey} from "../utils/ArrayHelper";
import {getRoomTypes} from "./roomType.services";

export async function addRooms(roomOptions) {
  try {
    if(!roomOptions) {
      return Promise.reject({status: 400, error: 'Invalid input.'});
    }

    if(! (roomOptions instanceof Array)) {
      roomOptions = [roomOptions];
    }

    return await Rooms.create(roomOptions);
  } catch (err) {
    console.log('err on addRooms:', err);
    return Promise.reject({status: 500, error: 'Internal error.'});
  }
}

export async function editRoom(roomId, roomOptions) {
  try {
    let room = await Rooms.findById(roomId);

    if(!room) {
      return Promise.reject({status: 404, error: 'Room not found.'});
    }

    room.description = roomOptions.description || room.description;
    room.photos = roomOptions.photos || room.photos;
    room.roomNumber = roomOptions.roomNumber || room.roomNumber;
    room.type = roomOptions.type || room.type;

    return await room.save();
  } catch (err) {
    console.log('err on editRoom:', err);
    return Promise.reject({status: 500, error: 'Internal error.'});
  }
}

export async function deleteRoom(roomId) {
  try {
    let room = await Rooms.findById(roomId);

    if(!room) {
      return Promise.reject({status: 404, error: 'Room not found.'});
    }

    return await room.remove();
  } catch (err) {
    console.log('err on editRoom:', err);
    return Promise.reject({status: 500, error: 'Internal error.'});
  }
}

export async function getRooms(start_date, end_date, roomTypeId, limit, format) {
  try {
    let currentBookingInRange = await getBookingInTimeRange(start_date, end_date);
    let bookingRoomIds = currentBookingInRange.map(booking => booking.room);

    let conditions = {
      _id: {$nin: bookingRoomIds},
      type: roomTypeId || {$ne: null}
    };
    // console.log('conditions:', conditions);
    let rooms = await Rooms.find(conditions).limit(limit).lean();

    if(format) {
      let grouped = groupByKey(rooms, 'type');
      let roomTypes = await getRoomTypes();
      let data = [];
      roomTypes.forEach(roomType => {
        roomType.available = grouped[roomType._id] ? grouped[roomType._id].length : 0;
        if(roomType.available) {
          data.push(roomType);
        }
      });

      return data;
    }

    return rooms;
  } catch (err) {
    console.log('err on getRooms:', err);
    return Promise.reject({status: 500, error: 'Internal error.'});
  }
}

export async function getRoomById(roomId) {
  try {
    return await Rooms.findById(roomId).lean();
  } catch (err) {
    console.log('err on getRoomById:', err);
    return Promise.reject({status: 500, error: 'Internal error.'});
  }
}

export async function formatBasicInfo(roomIds) {
  try {
    if(!(roomIds instanceof Array)) {
      roomIds = [roomIds];
    }

    return await Rooms.find({_id: {$in: roomIds}}, 'roomNumber type description').populate('type', ['name']).lean();
  } catch (err) {
    console.log('err on getRooms:', err);
    return Promise.reject({status: 500, error: 'Internal error.'});
  }
}
