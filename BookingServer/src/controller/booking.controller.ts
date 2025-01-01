// controllers/bookingController.ts

import { Request, Response } from 'express';
import * as bookingService from '../services/bookingService';

export async function createBooking(req: Request, res: Response) {
  try {
    const { userId, beautySalonId, date, services } = req.body;
    const booking = await bookingService.createBooking(userId, beautySalonId, date, services);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error});
  }
}

export async function getAllBookings(req: Request, res: Response) {
  try {
    const { name, minPrice, maxPrice, startDate, endDate } = req.query;
    const filters: any = {};

    if (name) {
      filters.services = {
        some: {
          service: { name: { contains: String(name) } },
        },
      };
    }

    if (minPrice || maxPrice) {
      filters.services = {
        ...filters.services,
        some: {
          service: {
            price: {
              gte: minPrice ? Number(minPrice) : undefined,
              lte: maxPrice ? Number(maxPrice) : undefined,
            },
          },
        },
      };
    }

    if (startDate || endDate) {
      filters.date = {};

      if (startDate) {
        filters.date.gte = new Date(Number(startDate));
      }

      if (endDate) {
        filters.date.lte = new Date(Number(endDate));
      }
    }

    const bookings = await bookingService.getAllBookings(filters);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bookings' });
  }
}

export async function getBooking(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const booking = await bookingService.getBookingById(id);
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching booking' });
  }
}

export async function updateBooking(req: Request, res: Response) {
  const { id } = req.params;
  const { userId, beautySalonId, date, status, services } = req.body;
  try {
    const updatedBooking = await bookingService.updateBookingById(id, userId, beautySalonId, date, status, services);
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: 'Error updating booking' });
  }
}

export async function deleteBooking(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await bookingService.deleteBookingById(id);
    res.status(200).json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting booking' });
  }
}

export async function getBookingsPdf(req: Request, res: Response) {
  try {
    const pdf = await bookingService.getBookingsPdf();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=bookings.pdf');
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ error: 'Error generating PDF' });
  }
}
