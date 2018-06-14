import mongoose from 'mongoose';
import globalConstants from '../globalConstants';

const Schema = mongoose.Schema;
const ROLE_ENUM = [globalConstants.userRoles.ADMIN, globalConstants.userRoles.CUSTOMER];

const userSchema = new Schema({
  userName: {type: String, default: '', index: true},
  idSocial: {type: String},
  type: {
    type: String,
    enum: ['normal', 'facebook', 'google'],
    default: 'normal'
  },
  email: {type: String, required: true, index: true},
  role: {
    type: String,
    enum: ROLE_ENUM,
    default: globalConstants.userRoles.CUSTOMER,
    index: true
  },
  password: {type: String},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  photo: {type: String},
  birthday: {type: Date},
  phone: {
    type: String, index: true
  },
  idNumber: {type: String, index: true},
  createdDate: {type: Date, default: Date.now}
});


userSchema.pre('save', async function(next) {
  this.wasNew = this.isNew;

  return next();
});

userSchema.post('save', async function(created, next) {
  if(this.wasNew) {

  }
  return next();
});

export default mongoose.model('User', userSchema);
