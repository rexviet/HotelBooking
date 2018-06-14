import express from 'express';
import {isAdmin} from '../middlewares/Auth';
import * as RoomController from '../controllers/room.controllers';
import {uploadRoomPhoto} from "../middlewares/Upload";

const router = express.Router();

router.route('/')
  .get(RoomController.getRooms)
  .post(isAdmin, uploadRoomPhoto.any(), RoomController.createRoom);

router.route('/:id')
  .get(RoomController.getRoomById)
  .put(isAdmin, uploadRoomPhoto.any(), RoomController.editRoom)
  .delete(isAdmin, RoomController.deleteRoom);

export default router;
