import express from "express";
import authenticate from "../middleware/authenticate";
import { validateRequest } from "../middleware/validateRequest";
import { salonSchema, updateSalonSchema } from "../validations/salon-validations";
import { checkRole } from "../middleware/checkRole";
import {
  createBeautySalonController,
  getAllBeautySalonsController,
  getBeautySalonController,
  updateBeautySalonController,
  deleteBeautySalonController,
} from "../controller/salon.controller";

const BeautySalonRouter = express.Router();

/**
 * @swagger
 * /beautysalons:
 *   get:
 *     summary: Get all beauty salons
 *     tags: [BeautySalons]
 *     responses:
 *       200:
 *         description: List of beauty salons
 *       500:
 *         description: Error fetching beauty salons
 */
BeautySalonRouter.get("/", getAllBeautySalonsController);

/**
 * @swagger
 * /beautysalons/{id}:
 *   get:
 *     summary: Get a beauty salon by ID
 *     tags: [BeautySalons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Beauty salon found
 *       404:
 *         description: Beauty salon not found
 *       500:
 *         description: Error fetching beauty salon
 */
BeautySalonRouter.get("/:id", getBeautySalonController);

/**
 * @swagger
 * tags:
 *   name: BeautySalons
 *   description: API for managing beauty salons
 */

/**
 * @swagger
 * /beautysalons:
 *   post:
 *     summary: Create a new beauty salon
 *     tags: [BeautySalons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the beauty salon
 *               location:
 *                 type: string
 *                 description: Location of the beauty salon
 *               phone:
 *                 type: string
 *                 description: Contact phone number for the beauty salon
 *               email:
 *                 type: string
 *                 description: Contact email for the beauty salon
 *               openingHours:
 *                 type: string
 *                 description: Operational hours for the beauty salon
 *               addressDetails:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     description: Street address of the beauty salon
 *                   city:
 *                     type: string
 *                     description: City where the beauty salon is located
 *                   zipCode:
 *                     type: string
 *                     description: ZIP code of the beauty salon
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID of the service (optional)
 *                     name:
 *                       type: string
 *                       description: Name of the service
 *                     price:
 *                       type: number
 *                       description: Price of the service
 *                     durationInMin:
 *                       type: number
 *                       description: Duration of the service in minutes
 *     responses:
 *       201:
 *         description: Beauty salon created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID of the newly created beauty salon
 *                 name:
 *                   type: string
 *                   description: Name of the beauty salon
 *                 location:
 *                   type: string
 *                   description: Location of the beauty salon
 *                 phone:
 *                   type: string
 *                   description: Contact phone number for the beauty salon
 *                 email:
 *                   type: string
 *                   description: Contact email for the beauty salon
 *                 openingHours:
 *                   type: string
 *                   description: Operational hours for the beauty salon
 *                 addressDetails:
 *                   type: object
 *                   properties:
 *                     street:
 *                       type: string
 *                       description: Street address of the beauty salon
 *                     city:
 *                       type: string
 *                       description: City where the beauty salon is located
 *                     zipCode:
 *                       type: string
 *                       description: ZIP code of the beauty salon
 *                 services:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: ID of the service
 *                       name:
 *                         type: string
 *                         description: Name of the service
 *                       price:
 *                         type: number
 *                         description: Price of the service
 *                       durationInMin:
 *                         type: number
 *                         description: Duration of the service in minutes
 *       500:
 *         description: Error creating beauty salon
 */

BeautySalonRouter.post(
  "/",
  authenticate,
  validateRequest(salonSchema),
  checkRole(["admin", "super_admin"]),
  createBeautySalonController
);

/**
 * @swagger
 * /beautysalons/{id}:
 *   patch:
 *     summary: Update a beauty salon by ID
 *     tags: [BeautySalons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Beauty salon updated successfully
 *       500:
 *         description: Error updating beauty salon
 */
BeautySalonRouter.patch(
  "/:id",
  validateRequest(updateSalonSchema),
  authenticate,
  checkRole("super_admin"),
  updateBeautySalonController
);

/**
 * @swagger
 * /beautysalons/{id}:
 *   delete:
 *     summary: Delete a beauty salon by ID
 *     tags: [BeautySalons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Beauty salon deleted successfully
 *       500:
 *         description: Error deleting beauty salon
 */
BeautySalonRouter.delete(
  "/:id",
  authenticate,
  checkRole("super_admin"),
  deleteBeautySalonController
);

export default BeautySalonRouter;
