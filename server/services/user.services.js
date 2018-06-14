import Users from '../models/users';
import bcryptjs from 'bcryptjs';
import {isObjectId} from "../utils/StringHelper";

export async function addUser(user) {
  try {
    if(user.password) {
      user.password = hashPassword(user.password);
    }
    return Users.create(user);
  } catch (err) {
    console.log('err on createUser:', err);
    return Promise.reject({status: 500, error: 'Internal error.'});
  }
}

export function hashPassword(plainPassword) {
  let salt = bcryptjs.genSaltSync(10);
  return bcryptjs.hashSync(plainPassword, salt);
}

export function comparePassword(password, user) {
  if(!password || !user.password) {
    return false;
  }
  return bcryptjs.compareSync(password, user.password);
}

export async function findByEmail(email) {
  try {
    return await Users.findOne({email: email}).lean();
    // return user ? deleteUnUseFields(user).pop() : null;
  } catch (err) {
    console.log('err on findByEmail:', err);
    return Promise.reject({status: 500, error: 'Internal error.'});
  }
}

export async function findById(id) {
  try {
    return await Users.findById(id).lean();
  } catch (err) {
    console.log('err on findById:', err);
    return Promise.reject({status: 500, error: 'Internal error.'});
  }
}

export async function findUserWithRoleById(id) {
  try {
    return await Users.findById(id, 'role').lean();
  } catch (err) {
    console.log('err on findById:', err);
    return Promise.reject({status: 500, error: 'Internal error.'});
  }
}

export function formatBasicInfo(userIds) {
  try {
    if(!(userIds instanceof Array)) {
      userIds = [userIds];
    }

    return Users.find({_id: {$in: userIds}}, 'userName firstName lastName photo').lean();
  } catch (err) {
    throw err;
  }
}

export async function getUserIdNumber(userId) {
  try {
    let user = await Users.findById(userId, 'idNumber').lean();
    if(!user) {
      return Promise.reject({status: 404, error: 'User not found.'});
    }

    return user.idNumber;
  } catch (err) {
    console.log('err on getUserIdNumber:', err);
    return Promise.reject({status: 500, error: 'Internal error.'});
  }
}
