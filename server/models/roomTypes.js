import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const roomTypeSchema = new Schema({
  name: {type: String},
  photos: [{type: String}],
  price: {type: Number, index: true},
  createdDate: {type: Date, default: Date.now}
});

export default mongoose.model('RoomType', roomTypeSchema);
