import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import protect from "../middlewares/middleWare.js";
import {
  CreatePost,
  getFeedPosts,
  getUserPosts,
  likePosts,
  addComment,
  countUserPosts
} from "../controllers/posts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/assets"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API endpoints related to posts
 */

/**
 * @swagger
 * /posts/create:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - picture
 *               - description
 *             properties:
 *               description:
 *                 type: string
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/create", protect, upload.single("picture"), CreatePost);

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all feed posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 */
router.get("/", protect, getFeedPosts);

/**
 * @swagger
 * /posts/{userId}/posts:
 *   get:
 *     summary: Get posts for a specific user
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User's posts retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/:userId/posts", protect, getUserPosts);

/**
 * @swagger
 * /posts/{id}/like:
 *   patch:
 *     summary: Like or unlike a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post liked/unliked successfully
 *       404:
 *         description: Post not found
 */
router.patch("/:id/like", protect, likePosts);

/**
 * @swagger
 * /posts/{postId}/comment:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment added successfully
 *       400:
 *         description: Invalid comment data
 */
router.post("/:postId/comment", protect, addComment);

/**
 * @swagger
 * /posts/{userId}/posts-stats:
 *   get:
 *     summary: Get the number of posts a user has made
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User's post count retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/:userId/posts-stats", protect, countUserPosts);

export default router;
