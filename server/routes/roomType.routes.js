import express from 'express';
import {isAdmin} from '../middlewares/Auth';
import * as RoomTypeController from '../controllers/roomType.controller';
import {uploadRoomTypePhoto} from "../middlewares/Upload";

const router = express.Router();

router.route('/')
  .post(isAdmin, uploadRoomTypePhoto.any(), RoomTypeController.addRoomType);

export default router;
