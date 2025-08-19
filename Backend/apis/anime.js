/**
 * @swagger
 * components:
 *   schemas:
 *     Anime:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         big_image:
 *           type: string
 *         cover_image:
 *           type: string
 *         desc:
 *           type: string
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *         episodes:
 *           type: array
 *           items:
 *             type: string
 */

const express = require("express");
const router = express.Router();
const { refreshToken, validateAnime, validateEditUser } = require("../middleware");
const {
  handleFetchSeries,
  handleFetchMovies,
  handleDeleteAnime,
  handleEditAnime,
  handleAddAnime,
  handleFetchFileCode,
  handleFetchFileInfo,
  handleSearchQuery,
  handleExpiryNotification,
  handleFetchFoldersById,
  handleFetchGenres,
  handleFetchAnimeByGenre,
  handleFetchAnimeById,
} = require("../controllers/anime");

/**
 * @swagger
 * /get_series:
 *   get:
 *     summary: Get all series
 *     tags: [Anime]
 *     responses:
 *       200:
 *         description: Series retrieved successfully
 */
router.get("/get_series", handleFetchSeries);

/**
 * @swagger
 * /get_movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Anime]
 *     responses:
 *       200:
 *         description: Movies retrieved successfully
 */
router.get("/get_movies", handleFetchMovies);

/**
 * @swagger
 * /delete_anime:
 *   post:
 *     summary: Delete anime
 *     tags: [Anime]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Anime deleted successfully
 */
router.post("/delete_anime", refreshToken, handleDeleteAnime);

/**
 * @swagger
 * /edit_anime:
 *   post:
 *     summary: Edit anime
 *     tags: [Anime]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Anime'
 *     responses:
 *       200:
 *         description: Anime edited successfully
 */
router.post("/edit_anime", refreshToken,validateAnime,validateEditUser,handleEditAnime);

/**
 * @swagger
 * /add_anime:
 *   post:
 *     summary: Add new anime
 *     tags: [Anime]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Anime'
 *     responses:
 *       200:
 *         description: Anime added successfully
 */
router.post("/add_anime", refreshToken,validateAnime, handleAddAnime);

/**
 * @swagger
 * /get_file_code/{id}:
 *   get:
 *     summary: Get file code for episode
 *     tags: [Anime]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File code retrieved
 */
router.get("/get_file_code/:id", handleFetchFileCode);

/**
 * @swagger
 * /get_info:
 *   post:
 *     summary: Get file information
 *     tags: [Anime]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               file_code:
 *                 type: string
 *     responses:
 *       200:
 *         description: File info retrieved
 */
router.post("/get_info", handleFetchFileInfo);

/**
 * @swagger
 * /search/{query}:
 *   get:
 *     summary: Search anime by query
 *     tags: [Anime]
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.get("/search/:query", handleSearchQuery);

/**
 * @swagger
 * /getSyncedfolders/{id}:
 *   get:
 *     summary: Get synced folders by ID
 *     tags: [Anime]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Synced folders retrieved
 */
router.get("/getSyncedfolders/:id",handleFetchFoldersById)

/**
 * @swagger
 * /genres:
 *   get:
 *     summary: Get all genres
 *     tags: [Anime]
 *     responses:
 *       200:
 *         description: Genres retrieved successfully
 */
router.get("/genres", handleFetchGenres);

/**
 * @swagger
 * /genre/{genre}:
 *   get:
 *     summary: Get anime by genre
 *     tags: [Anime]
 *     parameters:
 *       - in: path
 *         name: genre
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Anime by genre retrieved
 */
router.get("/genre/:genre", handleFetchAnimeByGenre);

/**
 * @swagger
 * /anime/{id}:
 *   get:
 *     summary: Get anime by ID
 *     tags: [Anime]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Anime retrieved successfully
 *       404:
 *         description: Anime not found
 */
router.get("/anime/:id", handleFetchAnimeById);

/**
 * @swagger
 * /setExpiryNotification/{id}/{type}:
 *   get:
 *     summary: Set expiry notification
 *     tags: [Anime]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expiry notification set
 */
router.get(
  "/setExpiryNotification/:id/:type",
  refreshToken,
  handleExpiryNotification
);

module.exports = router;
