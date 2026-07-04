import { Request, Response } from 'express';
import { Trainer } from '../models/Trainer';
import { Class } from '../models/Class';
import { Booking } from '../models/Booking';
import { AuthenticatedRequest } from '../types';

export const getTrainerClasses = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'You must be logged in.' }
      });
      return;
    }

    // Find trainer profile
    const trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer) {
      res.status(403).json({
        success: false,
        error: { code: 'NOT_A_TRAINER', message: 'No trainer catalog profile associated with this user.' }
      });
      return;
    }

    // Find classes
    const classes = await Class.find({ trainerId: trainer._id })
      .populate('programId')
      .sort({ date: 1, timeSlot: 1 });

    res.status(200).json({
      success: true,
      data: classes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'TRAINER_CLASSES_FETCH_FAILED',
        message: 'An error occurred fetching trainer schedules.'
      }
    });
  }
};

export const getClassBookings = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // Class ID
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'You must be logged in.' }
      });
      return;
    }

    // Verify class exists
    const targetClass = await Class.findById(id);
    if (!targetClass) {
      res.status(404).json({
        success: false,
        error: { code: 'CLASS_NOT_FOUND', message: 'Class session not found.' }
      });
      return;
    }

    // Check authorization (must be assigned trainer or admin)
    if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
      const trainer = await Trainer.findOne({ userId: req.user._id });
      if (!trainer || targetClass.trainerId.toString() !== trainer._id.toString()) {
        res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You do not have access to view this class bookings roster.' }
        });
        return;
      }
    }

    // Find bookings and populate user
    const bookings = await Booking.find({ classId: id })
      .populate('userId', 'firstName lastName email phone')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'ROSTER_FETCH_FAILED',
        message: 'An error occurred retrieving class enrollments roster.'
      }
    });
  }
};

export const updateAttendance = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // Booking ID
    const { status } = req.body; // 'attended' | 'no-show' | 'confirmed'

    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'You must be logged in.' }
      });
      return;
    }

    if (!['attended', 'no-show', 'confirmed'].includes(status)) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_STATUS', message: 'Status must be attended, no-show, or confirmed.' }
      });
      return;
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({
        success: false,
        error: { code: 'BOOKING_NOT_FOUND', message: 'Booking not found.' }
      });
      return;
    }

    // Check authorization (booking class must be assigned to this trainer, or user must be admin)
    if (req.user.role !== 'admin' && req.user.role !== 'super-admin') {
      const targetClass = await Class.findById(booking.classId);
      const trainer = await Trainer.findOne({ userId: req.user._id });
      if (!trainer || !targetClass || targetClass.trainerId.toString() !== trainer._id.toString()) {
        res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'You do not have permission to mark attendance for this booking.' }
        });
        return;
      }
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Attendance marked as ${status}.`,
      data: {
        bookingId: booking._id,
        status: booking.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'ATTENDANCE_UPDATE_FAILED',
        message: 'An error occurred updating attendance status.'
      }
    });
  }
};

export const getTrainersPublic = async (req: Request, res: Response): Promise<void> => {
  try {
    const trainers = await Trainer.find().populate({
      path: 'userId',
      select: 'firstName lastName email'
    });
    res.status(200).json({
      success: true,
      data: trainers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'TRAINERS_FETCH_FAILED',
        message: 'An error occurred fetching trainers.'
      }
    });
  }
};
