import express from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import roomTypeRoutes from './roomType.routes';
import roomRoutes from './room.routes';
import bookingRoutes from './booking.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/room-types', roomTypeRoutes);
router.use('/rooms', roomRoutes);
router.use('/booking', bookingRoutes);

export default router;
