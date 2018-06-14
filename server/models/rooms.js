import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  roomNumber: {type: String},
  type: {type: Schema.ObjectId, ref: 'RoomType', require: true, index: true},
  description: {type: String},
  photos: [{type: String}],
  createdDate: {type: Date, default: Date.now}
});

export default mongoose.model('Room', roomSchema);
