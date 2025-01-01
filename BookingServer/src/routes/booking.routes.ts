import express from "express";
import authenticate from "../middleware/authenticate";
import { validateRequest } from "../middleware/validateRequest";
import { bookingSchema } from "../validations/booking-validations"; // Define your schema
import { checkRole } from "../middleware/checkRole";
import {
  createBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  getBookingsPdf,
} from "../controller/booking.controller";

const BookingRouter = express.Router();

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags:
 *       - Bookings
 *     requestBody:
 *       description: Booking details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "67890"
 *               beautySalonId:
 *                 type: string
 *                 example: "c6c9489e-4fb0-4a84-8c01-eed396d9d8a0"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-01T14:00:00Z"
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     serviceId:
 *                       type: string
 *                       example: "9a9d4804-ce5a-4250-bdd3-df4928548fd2"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Booking time is outside of salon working hours or invalid services
 *       404:
 *         description: Beauty salon not found
 *       409:
 *         description: No available staff for the selected booking time due to overlapping bookings
 *       500:
 *         description: Error creating booking
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "abc123"
 *         userId:
 *           type: string
 *           example: "67890"
 *         beautySalonId:
 *           type: string
 *           example: "54321"
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T12:00:00Z"
 *         status:
 *           type: string
 *           enum: [pending, completed]
 *           example: "pending"
 *         services:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               serviceId:
 *                 type: string
 *                 example: "09876"
 */
BookingRouter.post(
  "/",
  validateRequest(bookingSchema),
  authenticate,
  createBooking
);


/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get a booking by ID
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The booking ID
 *     responses:
 *       200:
 *         description: Booking found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Error fetching booking
 */
BookingRouter.get("/", authenticate, getBooking);

/**
 * @swagger
 * /bookings/pdf:
 *   get:
 *     summary: Generate and download a PDF of booking details
 *     tags:
 *       - Bookings
 *     responses:
 *       200:
 *         description: A PDF file containing booking details
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error generating the PDF
 */

BookingRouter.get("/pdf", authenticate, getBookingsPdf);

/**
 * @swagger
 * /bookings/search:
 *   get:
 *     summary: Get a list of all bookings, services, and users with filtering and search options
 *     tags:
 *       - Bookings
 *     parameters:
 *       - name: name
 *         in: query
 *         description: Search by name (user, service, or salon)
 *         schema:
 *           type: string
 *       - name: minPrice
 *         in: query
 *         description: Minimum price for services
 *         schema:
 *           type: number
 *       - name: maxPrice
 *         in: query
 *         description: Maximum price for services
 *         schema:
 *           type: number
 *       - name: startDate
 *         in: query
 *         description: Filter bookings by start date (timestamp in milliseconds)
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: endDate
 *         in: query
 *         description: Filter bookings by end date (timestamp in milliseconds)
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: A list of bookings, services, and users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   booking:
 *                     $ref: '#/components/schemas/Booking'
 *                   service:
 *                     $ref: '#/components/schemas/Service'
 *                   user:
 *                     $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input (e.g., invalid date format)
 *       500:
 *         description: Error fetching data
 */
BookingRouter.get("/search", authenticate, getAllBookings);


/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Delete a booking
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The booking ID
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       500:
 *         description: Error deleting booking
 */
BookingRouter.delete("/:id", authenticate, checkRole(["admin", "super_admin"]), deleteBooking);

/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     summary: Update a booking
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The booking ID
 *     requestBody:
 *       description: Updated booking details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               beautySalonId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     serviceId:
 *                       type: string
 *                       example: "09876"
 *                     quantity:
 *                       type: integer
 *                       example: 1
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       500:
 *         description: Error updating booking
 */
BookingRouter.patch(
  "/:id",
  authenticate,
  checkRole(["admin", "super_admin"]),
  updateBooking
);

export default BookingRouter;
