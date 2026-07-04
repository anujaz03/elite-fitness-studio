import { Request, Response } from 'express';
import { Class } from '../models/Class';

export const getClassesSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, programId, trainerId } = req.query;

    let start: Date;
    if (startDate && typeof startDate === 'string') {
      const [y, m, d] = startDate.split('-').map(Number);
      start = new Date(y, m - 1, d, 0, 0, 0, 0);
    } else {
      start = new Date();
      start.setHours(0, 0, 0, 0);
    }

    let end: Date;
    if (endDate && typeof endDate === 'string') {
      const [y, m, d] = endDate.split('-').map(Number);
      end = new Date(y, m - 1, d, 23, 59, 59, 999);
    } else {
      end = new Date(start);
      end.setDate(start.getDate() + 7);
      end.setHours(23, 59, 59, 999);
    }

    const filter: any = {
      date: { $gte: start, $lte: end },
      status: 'scheduled'
    };

    if (programId && typeof programId === 'string') {
      filter.programId = programId;
    }
    if (trainerId && typeof trainerId === 'string') {
      filter.trainerId = trainerId;
    }

    const classes = await Class.find(filter)
      .populate('programId')
      .populate({
        path: 'trainerId',
        populate: {
          path: 'userId',
          select: 'firstName lastName'
        }
      })
      .sort({ date: 1, timeSlot: 1 });

    res.status(200).json({
      success: true,
      data: classes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SCHEDULE_FETCH_FAILED',
        message: (error as Error).message || 'An error occurred fetching class timetable.'
      }
    });
  }
};
