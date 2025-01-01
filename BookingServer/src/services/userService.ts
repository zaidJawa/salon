import bcrypt from 'bcrypt';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export interface EditUserPermissionsInput {
    phone?: string;
    password?: string;
    role?: Role;
    salonIds?: string[];
}

// Validate if the role is valid
export const isValidRole = (role: string | undefined): boolean => {
    return role ? ['user', 'admin', 'super_admin'].includes(role) : true;
};

// Check if a phone number is already in use
export const isPhoneInUse = async (phone: string, userId: string): Promise<boolean> => {
    const existingUserWithPhone = await prisma.user.findUnique({
        where: { phone },
    });
    return !!existingUserWithPhone && existingUserWithPhone.id !== userId;
};

// Update the user in the database
export const updateUser = async (
    userId: string,
    updates: Record<string, any>
) => {
    return prisma.user.update({
        where: { id: userId },
        data: updates,
    });
};

// Update the user-salon associations
export const updateUserSalons = async (userId: string, salonIds: string[]) => {
    // Remove existing associations
    await prisma.userSalon.deleteMany({
        where: { userId },
    });

    // Create new associations
    const userSalonAssociations = salonIds.map((salonId) => ({
        userId,
        salonId,
        assignedAt: new Date(),
    }));

    await prisma.userSalon.createMany({
        data: userSalonAssociations,
    });
};

// Hash the password
export const hashPassword = async (password: string) => {
    return bcrypt.hash(password, 10);
};




export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserByEmailOrPhone = async (email?: string, phone?: string) => {
  return prisma.user.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
  });
};

export const createUser = async (data: { name: string; email: string; password: string; phone: string }) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
};
