import express from "express";
import {
    editUserInfo
} from "../controller/user.controller";

const AuthRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and permissions
 */

/**
 * @swagger
 *  /user/{userId}:
 *   patch:
 *      summary: Edit user information
 *      description: Allows admin to edit user information including phone, password, role, and associated salons.
 *      tags: [User]
 *      parameters:
 *        - name: userId
 *          in: path
 *          required: true
 *          description: The ID of the user to edit.
 *          schema:
 *            type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                phone:
 *                  type: string
 *                password:
 *                  type: string
 *                role:
 *                  type: string
 *                  enum: [user, admin, super_admin]
 *                salonIds:
 *                  type: array
 *                  items:
 *                    type: string
 *              required:
 *                - role  # Added this to make role required if needed
 *      responses:
 *        200:
 *          description: Successfully updated user
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  updatedUser:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                      phone:
 *                        type: string
 *                      role:
 *                        type: string
 *        400:
 *          description: Invalid input or validation error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 */
AuthRouter.patch("/:userId", editUserInfo);


export default AuthRouter;
