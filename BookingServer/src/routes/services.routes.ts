import express from "express";
import authenticate from "../middleware/authenticate";
import { validateRequest } from "../middleware/validateRequest";
import { serviceSchema } from "../validations/services-validations"; // Import service schema
import { checkRole } from "../middleware/checkRole";
import {
  createServiceController,
  getServiceController,
  getAllServicesController,
  deleteServiceController,
  updateServiceController,
} from "../controller/service.controller";

const ServiceRouter = express.Router();


/**
 * @swagger
 * /services:
 *   get:
 *     summary: Get all services with pagination
 *     tags: [Services]
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Number of items per page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: cityId
 *         in: query
 *         description: Filter services by city ID
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of services with pagination data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 docs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
 *                 totalDocs:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       500:
 *         description: Error fetching services
 */
ServiceRouter.get("/", getAllServicesController);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service found
 *       404:
 *         description: Service not found
 *       500:
 *         description: Error fetching service
 */
ServiceRouter.get("/:id", getServiceController);

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: API for managing services
 */

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               durationInMin:
 *                 type: number
 *               salonId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Service created successfully
 *       500:
 *         description: Error creating service
 */
ServiceRouter.post(
  "/",
  validateRequest(serviceSchema),
  authenticate,
  checkRole(["admin", "super_admin"]),
  createServiceController
);
/**
 * @swagger
 * /services/{id}:
 *   patch:
 *     summary: Update a service by ID
 *     tags: [Services]
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
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       500:
 *         description: Error updating service
 */

ServiceRouter.patch(
  "/:id",
  authenticate,
  checkRole(["admin", "super_admin"]),
  updateServiceController
);


/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Delete a service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       500:
 *         description: Error deleting service
 */
ServiceRouter.delete(
  "/:id",
  authenticate,
  checkRole(["admin", "super_admin"]),
  deleteServiceController
);

export default ServiceRouter;
