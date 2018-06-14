import express from 'express';
import {isAuth} from '../middlewares/Auth';
import * as AuthController from '../controllers/auth.controllers';

const router = express.Router();

router.post('/registry', AuthController.registry);

router.post('/login', AuthController.login);

router.route('/refresh')
  .all(isAuth, AuthController.refreshToken);

router.post('/forgot', AuthController.forgotPassword);

router.all('/valid-token', AuthController.validToken);

router.post('/reset-password', AuthController.resetPassword);

export default router;
