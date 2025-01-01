// services/bookingService.ts

import { PrismaClient } from '@prisma/client';
import { Status } from '../enums';
import { generateBookingsPdf } from './generatePDFService';

const prisma = new PrismaClient();

export async function createBooking(userId: string, beautySalonId: string, date: string, services: any[]) {
  const bookingTime = new Date(date);

  const salon = await prisma.beautySalon.findUnique({
    where: { id: beautySalonId },
    include: { users: true },
  });

  if (!salon) throw new Error('Beauty salon not found');

  const startWorkingHours = salon.startWorkingHours?.split(':');
  const endWorkingHours = salon.endWorkingHours?.split(':');

  const startTime = new Date(bookingTime);
  const endTime = new Date(bookingTime);

  startTime.setHours(parseInt(startWorkingHours[0]), parseInt(startWorkingHours[1]), 0, 0);
  endTime.setHours(parseInt(endWorkingHours[0]), parseInt(endWorkingHours[1]), 0, 0);

  if (bookingTime < startTime || bookingTime >= endTime) {
    throw new Error('Booking time is outside of salon working hours');
  }

  const overlappingBookings = await prisma.booking.findMany({
    where: {
      beautySalonId,
      date: {
        gte: bookingTime,
        lt: new Date(bookingTime.getTime() + 60 * 60 * 1000),
      },
      status: Status.completed,
    },
  });

  if (overlappingBookings.length >= salon.users.length) {
    throw new Error('No available staff for the selected booking time');
  }

  const salonServices = await prisma.services.findMany({
    where: { salonId: beautySalonId },
    select: { id: true, name: true },
  });

  const invalidServices = services.filter((service) => !salonServices.find((s) => s.id === service.serviceId));

  if (invalidServices.length > 0) {
    throw new Error('One or more services are not provided by the salon');
  }

  const booking = await prisma.booking.create({
    data: {
      userId,
      beautySalonId,
      date,
      status: Status.pending,
      services: {
        create: services.map((service) => ({
          serviceId: service.serviceId,
        })),
      },
    },
  });

  return booking;
}

export async function getAllBookings(filters: any) {
  const bookings = await prisma.booking.findMany({
    where: filters,
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      services: {
        select: {
          service: {
            select: {
              name: true,
              price: true,
            },
          },
        },
      },
      beautySalon: {
        select: {
          id: true,
          name: true,
          location: true,
          phone: true,
        },
      },
    },
  });

  return bookings;
}

export async function getBookingById(id: string) {
  const booking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!booking) throw new Error('Booking not found');

  return booking;
}

export async function updateBookingById(id: string, userId: string, beautySalonId: string, date: string, status: Status, services: any[]) {
  const booking = await prisma.booking.update({
    where: { id },
    data: { userId, beautySalonId, date, status },
  });

  if (services) {
    await prisma.bookingService.deleteMany({
      where: { bookingId: id },
    });

    await prisma.bookingService.createMany({
      data: services.map((service) => ({
        bookingId: id,
        serviceId: service.serviceId,
      })),
    });
  }

  const updatedBooking = await prisma.booking.findUnique({
    where: { id },
    include: { services: true },
  });

  return updatedBooking;
}

export async function deleteBookingById(id: string) {
  await prisma.booking.delete({
    where: { id },
  });
}

export async function getBookingsPdf() {
  const bookings = await prisma.booking.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      services: {
        select: {
          service: {
            select: {
              name: true,
              price: true,
            },
          },
        },
      },
      beautySalon: {
        select: {
          id: true,
          name: true,
          location: true,
          phone: true,
        },
      },
    },
  });

  const formattedBookings = bookings.map((booking) => {
    const services = booking.services.map((serviceBooking) => ({
      serviceName: serviceBooking.service.name,
      servicePrice: serviceBooking.service.price,
    }));

    return {
      booking: {
        id: booking.id,
        userId: booking.userId,
        beautySalonId: booking.beautySalonId,
        date: booking.date.toISOString(),
        status: booking.status,
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
      },
      user: {
        name: booking.user.name,
        email: booking.user.email,
        phone: booking.user.phone,
      },
      services,
      beautySalon: {
        id: booking.beautySalon.id,
        name: booking.beautySalon.name,
        location: booking.beautySalon.location,
        phone: booking.beautySalon.phone,
      },
    };
  });

  const pdf = await generateBookingsPdf({ bookings: formattedBookings });

  return pdf;
}
