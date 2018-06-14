import * as RoomTypeServices from '../services/roomType.services';

export async function addRoomType(req, res) {
  try {
    let photos = req.files.map(file => file.dataPath);
    let roomType = await RoomTypeServices.addRoomTypes({
      name: req.body.name,
      price: req.body.price,
      photos
    });
    return res.status(200).json({
      success: true,
      data: roomType.pop()
    });
  } catch (err) {
    err.success = false;
    err.error = err.error || 'Internal error.';
    return res.status(err.status || 500).json(err);
  }
}
