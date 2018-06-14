import configs from '../config';
import jwt from 'jsonwebtoken';

module.exports = {
  // Generates a token from supplied payload
  issue: (payload) => {
    return jwt.sign(payload, configs.JWT_SECRET);
  },

  // Verifies token on a request
  verify: (token, callback) => {
    return jwt.verify(token, configs.JWT_SECRET, callback);
  }
};