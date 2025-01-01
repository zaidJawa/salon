import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createBeautySalon = async (data: {
  name: string;
  location: string;
  phone: string;
  startWorkingHours: string;
  endWorkingHours: string;
  services: { id?: string; name: string; price: number; durationInMin: number }[];
}) => {
  try {
    const result = await prisma.beautySalon.create({
      data: {
        name: data.name,
        location: data.location,
        phone: data.phone,
        startWorkingHours: data.startWorkingHours,
        endWorkingHours: data.endWorkingHours,
        services: {
          connectOrCreate: data.services.map(({ id, name, price, durationInMin }) => ({
            where: { id: id || "" },
            create: { name, price, durationInMin },
          })),
        },
      },
    });
    return result;
  } catch (error) {
    console.error("Error creating beauty salon:", error);
    throw new Error("Failed to create beauty salon.");
  }
};





export const getAllBeautySalons = async () => {
  return prisma.beautySalon.findMany();
};

export const getBeautySalonById = async (id: string) => {
  return prisma.beautySalon.findUnique({
    where: { id },
  });
};

export const updateBeautySalon = async (id: string, data: { name?: string; location?: string; phone?: string }) => {
  return prisma.beautySalon.update({
    where: { id },
    data,
  });
};

export const deleteBeautySalon = async (id: string) => {
  return prisma.beautySalon.delete({
    where: { id },
  });
};
