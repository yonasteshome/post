import express from "express";
import { getUser, getUserFriends, addRemoveFriends, getNotFriends } from "../controllers/users.js";
import protect from "../middlewares/middleWare.js";

const router = express.Router(); // Initialize new router instance

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User-related endpoints
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/:id", protect, getUser);

/**
 * @swagger
 * /user/{id}/friends:
 *   get:
 *     summary: Get a user's friends
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Friends list retrieved
 *       404:
 *         description: User not found
 */
router.get("/:id/friends", getUserFriends);

/**
 * @swagger
 * /user/{id}/{friendId}:
 *   patch:
 *     summary: Add or remove a friend
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: friendId
 *         description: Friend ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Friend added or removed
 *       404:
 *         description: User or friend not found
 */
router.patch("/:id/:friendId", protect, addRemoveFriends);

/**
 * @swagger
 * /user/{id}/notfriends:
 *   get:
 *     summary: Get users who are not friends yet
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users not friends with this user
 *       404:
 *         description: User not found
 */
router.get("/:id/notfriends", protect, getNotFriends);

export default router;
