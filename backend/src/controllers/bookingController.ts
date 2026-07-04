import { Response } from 'express';
import mongoose from 'mongoose';
import { Booking } from '../models/Booking';
import { Class } from '../models/Class';
import { UserMembership } from '../models/UserMembership';
import { AuthenticatedRequest } from '../types';
import { createBookingSchema } from '../validators/bookingValidators';

export const createBooking = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'You must be logged in.' }
      });
      return;
    }

    // 1. Validate inputs
    const parsed = createBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Booking request inputs invalid',
          details: parsed.error.issues.map((i) => ({ field: i.path[0], message: i.message }))
        }
      });
      return;
    }

    const { classId } = parsed.data;

    // 2. Check active membership status
    const activeMembership = await UserMembership.findOne({
      userId: req.user._id,
      status: 'active',
      endDate: { $gte: new Date() }
    }).session(session);

    if (!activeMembership) {
      res.status(400).json({
        success: false,
        error: {
          code: 'NO_ACTIVE_MEMBERSHIP',
          message: 'An active membership subscription is required to book classes.'
        }
      });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // 3. Find and check scheduled class details
    const targetClass = await Class.findById(classId).session(session);
    if (!targetClass) {
      res.status(404).json({
        success: false,
        error: { code: 'CLASS_NOT_FOUND', message: 'The requested class session does not exist.' }
      });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    if (targetClass.status !== 'scheduled') {
      res.status(400).json({
        success: false,
        error: { code: 'CLASS_NOT_SCHEDULED', message: 'This class has been cancelled or completed.' }
      });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // 4. Check class date/time has not already passed
    const [hours, minutes] = targetClass.timeSlot.split(':').map(Number);
    const classStart = new Date(targetClass.date);
    classStart.setHours(hours, minutes, 0, 0);
    if (classStart.getTime() <= Date.now()) {
      res.status(400).json({
        success: false,
        error: { code: 'CLASS_ALREADY_PASSED', message: 'Cannot book a class that has already started.' }
      });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // 5. Check if class is full
    if (targetClass.slotsOccupied >= targetClass.capacity) {
      res.status(409).json({
        success: false,
        error: { code: 'CLASS_FULL', message: 'This class has reached maximum enrollment capacity.' }
      });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // 6. Check duplicate booking
    const duplicate = await Booking.findOne({
      userId: req.user._id,
      classId,
      status: { $in: ['confirmed', 'pending'] }
    }).session(session);

    if (duplicate) {
      res.status(409).json({
        success: false,
        error: { code: 'DUPLICATE_BOOKING', message: 'You have already reserved a slot for this class.' }
      });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // 7. Increment occupied slots on Class
    targetClass.slotsOccupied += 1;
    await targetClass.save({ session });

    // 8. Create booking record
    const booking = await Booking.create(
      [
        {
          userId: req.user._id,
          classId,
          status: 'confirmed'
        }
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Class booked successfully.',
      data: {
        bookingId: booking[0]._id,
        status: booking[0].status
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      error: {
        code: 'BOOKING_CREATION_FAILED',
        message: (error as Error).message || 'An error occurred during booking creation.'
      }
    });
  }
};

export const getMyBookings = async (
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

    const bookings = await Booking.find({ userId: req.user._id })
      .populate({
        path: 'classId',
        populate: [
          { path: 'programId', select: 'title difficulty estimatedCaloriesBurned durationMinutes' },
          {
            path: 'trainerId',
            populate: { path: 'userId', select: 'firstName lastName' }
          }
        ]
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'BOOKINGS_FETCH_FAILED',
        message: 'An error occurred retrieving your bookings.'
      }
    });
  }
};

export const cancelBooking = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'You must be logged in.' }
      });
      return;
    }

    // 1. Find booking
    const booking = await Booking.findById(id).session(session);
    if (!booking) {
      res.status(404).json({
        success: false,
        error: { code: 'BOOKING_NOT_FOUND', message: 'The booking was not found.' }
      });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // 2. Authorization check
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'super-admin') {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to cancel this booking.' }
      });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    if (booking.status === 'cancelled') {
      res.status(400).json({
        success: false,
        error: { code: 'BOOKING_ALREADY_CANCELLED', message: 'This booking has already been cancelled.' }
      });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // 3. Find related class
    const targetClass = await Class.findById(booking.classId).session(session);
    if (!targetClass) {
      res.status(404).json({
        success: false,
        error: { code: 'CLASS_NOT_FOUND', message: 'The associated class session does not exist.' }
      });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // 4. Verify 4-hour cancellation rule
    const [hours, minutes] = targetClass.timeSlot.split(':').map(Number);
    const classStart = new Date(targetClass.date);
    classStart.setHours(hours, minutes, 0, 0);

    const timeDiff = classStart.getTime() - Date.now();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    // Skip the threshold check if user is admin
    if (hoursDiff < 4 && req.user.role !== 'admin' && req.user.role !== 'super-admin') {
      res.status(400).json({
        success: false,
        error: {
          code: 'CANCELLATION_WINDOW_CLOSED',
          message: 'Cancellations are locked less than 4 hours before class start.'
        }
      });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // 5. Update booking status
    booking.status = 'cancelled';
    booking.cancellationTime = new Date();
    await booking.save({ session });

    // 6. Decrement class occupancy
    if (targetClass.slotsOccupied > 0) {
      targetClass.slotsOccupied -= 1;
      await targetClass.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully.'
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      error: {
        code: 'BOOKING_CANCELLATION_FAILED',
        message: 'An error occurred during booking cancellation.'
      }
    });
  }
};

export const rescheduleBooking = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params; // Old booking ID
    const { newClassId } = req.body;

    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'You must be logged in.' }
      });
      return;
    }

    // 1. Find old booking
    const booking = await Booking.findById(id).session(session);
    if (!booking) {
      res.status(404).json({
        success: false,
        error: { code: 'BOOKING_NOT_FOUND', message: 'The booking was not found.' }
      });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    if (booking.status === 'cancelled') {
      res.status(400).json({
        success: false,
        error: { code: 'BOOKING_CANCELLED', message: 'Cannot reschedule a cancelled booking.' }
      });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // 2. Verify 4-hour cancellation rule on old class
    const oldClass = await Class.findById(booking.classId).session(session);
    if (oldClass) {
      const [hours, minutes] = oldClass.timeSlot.split(':').map(Number);
      const classStart = new Date(oldClass.date);
      classStart.setHours(hours, minutes, 0, 0);

      const timeDiff = classStart.getTime() - Date.now();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff < 4 && req.user.role !== 'admin' && req.user.role !== 'super-admin') {
        res.status(400).json({
          success: false,
          error: {
            code: 'CANCELLATION_WINDOW_CLOSED',
            message: 'Cannot reschedule less than 4 hours before the old class starts.'
          }
        });
        await session.abortTransaction();
        session.endSession();
        return;
      }
    }

    // 3. Find and check new class details
    const newClass = await Class.findById(newClassId).session(session);
    if (!newClass) {
      res.status(404).json({
        success: false,
        error: { code: 'NEW_CLASS_NOT_FOUND', message: 'The target class session does not exist.' }
      });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    if (newClass.status !== 'scheduled') {
      res.status(400).json({
        success: false,
        error: { code: 'NEW_CLASS_NOT_SCHEDULED', message: 'The target class is cancelled or completed.' }
      });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // 4. Check new class is not full
    if (newClass.slotsOccupied >= newClass.capacity) {
      res.status(409).json({
        success: false,
        error: { code: 'NEW_CLASS_FULL', message: 'The target class is fully booked.' }
      });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // 5. Check if user already has a booking for the new class
    const duplicate = await Booking.findOne({
      userId: req.user._id,
      classId: newClassId,
      status: { $in: ['confirmed', 'pending'] }
    }).session(session);

    if (duplicate) {
      res.status(409).json({
        success: false,
        error: { code: 'DUPLICATE_BOOKING', message: 'You already have a reserved slot for the target class.' }
      });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // 6. Decrement old class slotsOccupied
    if (oldClass && oldClass.slotsOccupied > 0) {
      oldClass.slotsOccupied -= 1;
      await oldClass.save({ session });
    }

    // 7. Increment new class slotsOccupied
    newClass.slotsOccupied += 1;
    await newClass.save({ session });

    // 8. Update booking record
    booking.classId = newClassId as any;
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Booking rescheduled successfully.',
      data: {
        bookingId: booking._id,
        classId: booking.classId
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      error: {
        code: 'BOOKING_RESCHEDULE_FAILED',
        message: 'An error occurred during booking rescheduling.'
      }
    });
  }
};
