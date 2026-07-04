import { Request, Response } from 'express';
import { Program } from '../models/Program';

export const getPrograms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { difficulty } = req.query;
    const filter: any = {};
    
    if (difficulty && typeof difficulty === 'string') {
      filter.difficulty = difficulty;
    }

    const programs = await Program.find(filter);
    
    res.status(200).json({
      success: true,
      data: programs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PROGRAMS_FETCH_FAILED',
        message: 'An error occurred fetching programs directory.'
      }
    });
  }
};

export const getProgramById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const program = await Program.findById(id);

    if (!program) {
      res.status(404).json({
        success: false,
        error: {
          code: 'PROGRAM_NOT_FOUND',
          message: 'The requested program was not found.'
        }
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: program
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PROGRAM_FETCH_FAILED',
        message: 'An error occurred fetching program details.'
      }
    });
  }
};
