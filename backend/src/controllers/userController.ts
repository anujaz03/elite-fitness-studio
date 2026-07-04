import { Response } from 'express';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../types';
import { updateProfileSchema } from '../validators/userValidators';

export const updateProfile = async (
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

    // 1. Validation
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Profile update details invalid',
          details: parsed.error.issues.map((i) => ({ field: i.path[0], message: i.message }))
        }
      });
      return;
    }

    const { firstName, lastName, phone, address, profileImage } = parsed.data;

    // 2. Find and update
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found.' }
      });
      return;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PROFILE_UPDATE_FAILED',
        message: 'An error occurred during profile update.'
      }
    });
  }
};
