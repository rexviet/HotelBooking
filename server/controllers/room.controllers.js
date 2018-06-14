import * as RoomServices from '../services/room.services';
import {isValidRoomType} from "../services/roomType.services";
import {isObjectId} from "../utils/StringHelper";
import {isValidDate} from "../utils/DateTimeHelper";

export async function createRoom(req, res) {
  try {
    let type = req.body.type;
    let validType = await isValidRoomType(type);
    if(!validType) {
      return res.status(400).json({success: false, error: 'Invalid room type'});
    }

    let photos = req.files ? req.files.map(file => file.dataPath) : [];

    let roomOptions = {
      roomNumber: req.body.roomNumber,
      type,
      description: req.body.description,
      photos
    };

    let rooms = await RoomServices.addRooms(roomOptions);

    return res.status(200).json({
      success: true,
      data: rooms.pop()
    });
  } catch (err) {
    err.success = false;
    err.error = err.error || 'Internal error.';
    return res.status(err.status || 500).json(err);
  }
}

export async function editRoom(req, res) {
  try {
    let roomId = req.params.id;
    if(!isObjectId(roomId)) {
      return res.status(404).json({success: false, error: 'Room not found.'});
    }

    let type = req.body.type;
    let validType = await isValidRoomType(type);
    if(!validType) {
      return res.status(400).json({success: false, error: 'Invalid room type'});
    }

    let photos = req.files ? req.files.map(file => file.dataPath) : undefined;

    let roomOptions = {
      roomNumber: req.body.roomNumber,
      type,
      description: req.body.description,
      photos
    };

    let data = await RoomServices.editRoom(roomId, roomOptions);

    return res.status(200).json({success: true, data});
  } catch (err) {
    err.success = false;
    err.error = err.error || 'Internal error.';
    return res.status(err.status || 500).json(err);
  }
}

export async function deleteRoom(req, res) {
  try {
    let roomId = req.params.id;
    if(!isObjectId(roomId)) {
      return res.status(404).json({success: false, error: 'Room not found.'});
    }

    await RoomServices.deleteRoom(roomId);

    return res.status(200).json({success: true});
  } catch (err) {
    err.success = false;
    err.error = err.error || 'Internal error.';
    return res.status(err.status || 500).json(err);
  }
}

export async function getRoomById(req, res) {
  try {
    let roomId = req.params.id;
    if(!isObjectId(roomId)) {
      return res.status(404).json({success: false, error: 'Room not found.'});
    }

    return res.status(200).json({
      success: true,
      data: await await RoomServices.getRoomById(roomId)
    });
  } catch (err) {
    err.success = false;
    err.error = err.error || 'Internal error.';
    return res.status(err.status || 500).json(err);
  }
}

export async function getRooms(req, res) {
  try {
    let type = req.query.type;
    let validType = await isValidRoomType(type);
    if(!validType) {
      type = null;
    }

    let start_date = new Date( Number(req.query.start).valueOf() );
    if(!isValidDate(start_date)) {
      start_date = null;
    }

    let end_date = new Date( Number(req.query.end).valueOf() );
    if(!isValidDate(end_date)) {
      end_date = null;
    }

    let data = await RoomServices.getRooms(start_date, end_date, type, null, true);

    return res.status(200).json({
      success: true,
      data
    })
  } catch (err) {
    err.success = false;
    err.error = err.error || 'Internal error.';
    return res.status(err.status || 500).json(err);
  }
}
