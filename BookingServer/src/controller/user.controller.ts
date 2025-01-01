import { Request, Response } from 'express';
import {
    EditUserPermissionsInput,
    isValidRole,
    isPhoneInUse,
    updateUser,
    updateUserSalons,
    hashPassword,
} from '../services/userService';

export const editUserInfo = async (req: Request, res: Response) => {
    const userId: string = req.params.userId;
    const { phone, password, role, salonIds }: EditUserPermissionsInput = req.body;

    try {
        // Validate the role
        if (role && !isValidRole(role)) {
            res.status(400).json({ error: 'Invalid role specified.' });
            return;
        }

        const updates: Record<string, any> = {};

        // Update phone if provided
        if (phone) {
            if (await isPhoneInUse(phone, userId)) {
                res.status(400).json({ error: 'This phone number is already in use.' });
                return;
            }
            updates.phone = phone;
        }

        // Update password if provided
        if (password) {
            const hashedPassword = await hashPassword(password);

            updates.password = hashedPassword;
        }

        // Update role if provided
        if (role) {
            updates.role = role;
        }

        // Update user details
        const updatedUser = await updateUser(userId, updates);

        // Update user-salon associations if salonIds are provided
        if (salonIds && salonIds.length > 0) {
            await updateUserSalons(userId, salonIds);
        }

        res.status(200).json({
            success: true,
            updatedUser: {
                id: updatedUser.id,
                phone: updatedUser.phone,
                role: updatedUser.role,
            },
        });
    } catch (error) {
        console.error('Error updating user permissions:', error);
        res.status(500).json({ error: 'An error occurred while updating user information.' });
    }
};
