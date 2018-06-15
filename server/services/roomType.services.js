import RoomTypes from '../models/roomTypes';
import {isObjectId} from "../utils/StringHelper";

export async function getRoomTypes() {
  try {
    return await RoomTypes.find({}, 'name price photos').lean();
  } catch (err) {
    console.log('err on getRoomTypes:', err);
    return Promise.reject({status: 500, error: 'Internal error.'});
  }
}

export async function addRoomTypes(roomTypeOptions) {
  try {
    if(!roomTypeOptions) {
      return Promise.reject({status: 400, error: 'Invalid input.'});
    }

    if(! (roomTypeOptions instanceof Array)) {
      roomTypeOptions = [roomTypeOptions];
    }

    return await RoomTypes.create(roomTypeOptions);
  } catch (err) {
    console.log('err on addRoomTypes:', err);
    return Promise.reject({status: 500, error: 'Internal error.'});
  }
}

export async function isValidRoomType(typeId) {
  try {
    if(!typeId) {
      return false;
    }

    if(!isObjectId(typeId)) {
      return false;
    }

    let roomType = await RoomTypes.findById(typeId, '_id').lean();

    return !!roomType;
  } catch (err) {
    console.log('err on isValidRoomType:', err);
    return false;
  }
}

export async function getRoomTypePrice(roomTypeId) {
  try {
    if(!isObjectId(roomTypeId)) {
      return 0;
    }

    let roomType = await RoomTypes.findById(roomTypeId, 'price').lean();
    if(!roomType) {
      return 0;
    }

    return roomType.price;
  } catch (err) {
    console.log('err on getRoomTypePrice:', err);
    return Promise.reject({status: 500, error: 'Internal error.'});
  }
}
