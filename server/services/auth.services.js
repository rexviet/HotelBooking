import {addUser, findByEmail, comparePassword, hashPassword, updatePassword} from "./user.services";
import {randomString} from "../utils/StringHelper";
import globalConstants from '../globalConstants';

const ONE_DAY_IN_SECONDS = 86400;

export async function registry(userOptions) {
  try {
    let user = await addUser(userOptions);
    user = JSON.parse(JSON.stringify(user));
    delete user.password;
    return user;
  } catch (err) {
    throw err;
  }
}

export async function login(email, pass) {
  try {
    let user = await findByEmail(email);
    if(!user) return null;

    let matchPassword = comparePassword(pass, user);
    if(!matchPassword) return null;

    return user;
  } catch (err) {
    throw err;
  }
}

// export async function forgotPassword(email) {
//   try {
//     let user = await findByEmail(email);
//
//     if(user) {
//       let randString = randomString(6);
//       console.log('randString:', randString);
//       await Redis.set('forget_pass_' + randString, {data: email, ex: ONE_DAY_IN_SECONDS});
//
//       let sendMailData = {
//         type: 'forgotPassword',
//         data: {email: email, token: randString}
//       };
//
//       Queue.getInstance().pushJob(globalConstants.jobName.SEND_MAIL, sendMailData);
//     }
//   } catch (err) {
//     console.log('err on forgotPassword:', err);
//     return Promise.reject({status: 500, error: 'Internal error.'});
//   }
// }
//
// export async function validToken(token) {
//   try {
//     console.log('token:', token);
//     let email = await Redis.get('forget_pass_' + token);
//
//     return !!email;
//   } catch (err) {
//     return Promise.reject({status: 500, error: 'Internal error.'});
//   }
// }
//
// export async function resetPassword(token, password) {
//   try {
//     let email = await Redis.get('forget_pass_' + token);
//     if(!email) {
//       return Promise.reject({status: 400, error: 'Invalid token.'});
//     }
//
//     let hashedPassword = await hashPassword(password);
//     await Promise.all([
//       updatePassword(email, hashedPassword),
//       Redis.del('forget_pass_' + token)
//     ]);
//     console.log('b');
//
//   } catch (err) {
//     return Promise.reject({status: 500, error: 'Internal error.'});
//   }
// }
