import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const editBookingSchema = new Schema({
  user: {type: Schema.ObjectId, required: true, index: true},
  type: {
    type: String,
    enum: ['customer', 'admin'],
    index: true
  },
  booking: {type: Schema.ObjectId, required: true, index: true},
  oldBooking: {type: Object},
  newBooking: {type: Object},
  changed: {type: Array},
  createdDate: {type: Date, default: Date.now}
});

export default mongoose.model('EditBooking', editBookingSchema);
