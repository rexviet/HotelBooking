import * as AuthServices from '../services/auth.services';
import {isValidEmail, } from "../utils/StringHelper";
import {findByEmail} from "../services/user.services";
import jwToken from '../libs/jwToken';

export async function registry(req, res) {
  try {
    let email = (req.body.email);
    if(!email || !isValidEmail(email)) {
      return res.status(400).json({success: false, error: 'Invalid email.'});
    }

    let existUser = await findByEmail(email);
    if(existUser) {
      return res.status(400).json({success: false, error: 'This email has been used.'});
    }

    if(!req.body.password || !req.body.confirmPassword || req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({success: false, error: 'Passwords not match.'});
    }

    let firstName = (req.body.firstName), lastName = (req.body.lastName);
    if(!firstName || !lastName) {
      return res.status(400).json({success: false, error: 'Invalid name.'});
    }
    let userOptions = {
      email,
      password: req.body.password,
      firstName,
      lastName
    };

    return res.json({
      success: true, data: await AuthServices.registry(userOptions)
    });
  } catch (err) {
    err.success = false;
    err.error = err.error || 'Internal error.';
    return res.status(err.status || 500).json(err);
  }
}

export async function socialAuth(req, res) {
  let user = JSON.parse(JSON.stringify(req.user));
  user.password = undefined;
  user = formatUserRoles(user);
  return res.json({
    success: true,
    data: {
      user: user,
      token: jwToken.issue({_id: user._id})
    }
  });
}

export async function login(req, res) {
  try {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
      return res.status(401).json({
        success: false,
        err: 'Invalid email or password.'
      });
    }

    let user = await AuthServices.login(email, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        err: 'Invalid email or password.'
      });
    }

    user = JSON.parse(JSON.stringify(user));
    user.password = undefined;

    return res.json({
      success: true,
      data: {
        user: user,
        token: jwToken.issue({_id: user._id})
      }
    });
  } catch (err) {
    err.success = false;
    err.error = err.error || 'Internal error.';
    return res.status(err.status || 500).json(err);
  }
}

export async function refreshToken(req, res) {
  try {
    let newToken = jwToken.issue(req.user);
    return res.json({success: true, data: newToken});
  } catch (err) {
    err.success = false;
    err.error = err.error || 'Internal error.';
    return res.status(err.status || 500).json(err);
  }
}

export async function forgotPassword(req, res) {
  try {
    let email = req.body.email;
    if(!isValidEmail(email)) {
      return res.status(400).json({success: false, error: 'Invalid email.'});
    }

    let data = await AuthServices.forgotPassword(email);

    return res.json({success: true, data});
  } catch (err) {
    err.success = false;
    err.error = err.error || 'Internal error.';
    return res.status(err.status || 500).json(err);
  }
}

export async function validToken(req, res) {
  try {
    let valid = await AuthServices.validToken(req.query.token);

    return res.json({success: true, valid});
  } catch (err) {
    err.success = false;
    err.error = err.error || 'Internal error.';
    return res.status(err.status || 500).json(err);
  }
}

export async function resetPassword(req, res) {
  try {
    if((!req.body.password || !req.body.confirmPassword) || (req.body.password !== req.body.confirmPassword)) {
      return res.json(400, {
        success: false,
        err: 'Password doesn\'t match.'
      });
    }

    await AuthServices.resetPassword(req.query.token, req.body.password);

    return res.status(200).json({success: true});
  } catch (err) {
    err.success = false;
    err.error = err.error || 'Internal error.';
    return res.status(err.status || 500).json(err);
  }
}
