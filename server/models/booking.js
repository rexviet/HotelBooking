import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  uniqueCode: {type: String, unique: true},
  idNumber: {type: String, index: true},
  user: {type: Schema.ObjectId, ref: 'User', require: true, index: true},
  room: { type: Schema.ObjectId, ref: 'Room', required: true, index: true},
  price: {type: Number},
  start_date: {type: Date, index: true},
  end_date: {type: Date, index: true},
  createdDate: {type: Date, default: Date.now},
  updatedDate: {type: Date, default: Date.now},
  status: {
    type: String,
    enum: ['new', 'activated', 'canceled'],
    default: 'new',
    index: true
  }
});

bookingSchema.post('pre', function (next) {
  this.updatedDate = new Date();
  return next();
});

export default mongoose.model('Booking', bookingSchema);
