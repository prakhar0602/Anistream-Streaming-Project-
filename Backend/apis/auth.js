/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         type:
 *           type: string
 *     UserStats:
 *       type: object
 *       properties:
 *         bool:
 *           type: boolean
 *         totalUsers:
 *           type: number
 *         onlineUsers:
 *           type: number
 */

const express = require('express');
const router = express.Router();
const { validateSignup, validateLogin, refreshToken, validateAdmin } = require('../middleware');
const  {
    handleAddUser,
    handleVerifyToken,
    handleLogin,
    handleFetchWishlist,
    handleToggleWishlist,
    handleLogout,
    sendCode,
    verifyCode,
    handleAddViewed,
    handleTraining,
    handleGetRecommendations,
    handleGetUserStats,
    handleGetAnimeStats,
    handleGetViewedAnalytics,
    handleGetOnlineUsers,
    handleGetAllUsers,
    handleGetUserProfile,
    handleEditProfile,
    handleDownloadCSV
} = require('../controllers/auth')

/**
 * @swagger
 * /add_user:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               repeat_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 */
router.post('/add_user',validateSignup,handleAddUser );


/**
 * @swagger
 * /verify_token:
 *   get:
 *     summary: Verify user token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token verified
 */
router.get('/verify_token',refreshToken, handleVerifyToken)

/**
 * @swagger
 * /sendOTP:
 *   post:
 *     summary: Send OTP for email verification
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post('/sendOTP',sendCode)

/**
 * @swagger
 * /verifyOTP:
 *   post:
 *     summary: Verify OTP code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               OTP:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 */
router.post('/verifyOTP',verifyCode)

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login',validateLogin, handleLogin); 

/**
 * @swagger
 * /get_wishlist:
 *   post:
 *     summary: Get user wishlist
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 */
router.post('/get_wishlist',refreshToken, handleFetchWishlist)

/**
 * @swagger
 * /toggle_wishlist:
 *   post:
 *     summary: Add/remove item from wishlist
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Wishlist updated successfully
 */
router.post('/toggle_wishlist',refreshToken,handleToggleWishlist)

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: User logout
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.get('/logout',refreshToken, handleLogout)

/**
 * @swagger
 * /add_viewed:
 *   post:
 *     summary: Add anime to viewed list
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Added to viewed list
 */
router.post('/add_viewed', refreshToken, handleAddViewed)

/**
 * @swagger
 * /training:
 *   post:
 *     summary: Train recommendation model
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Training completed
 */
router.post('/training', refreshToken, handleTraining)

/**
 * @swagger
 * /recommendations:
 *   get:
 *     summary: Get user recommendations
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Recommendations retrieved
 */
router.get('/recommendations', refreshToken, handleGetRecommendations)

/**
 * @swagger
 * /user_stats:
 *   get:
 *     summary: Get user statistics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserStats'
 *       403:
 *         description: Admin access required
 */
router.get('/user_stats', refreshToken, validateAdmin, handleGetUserStats)

/**
 * @swagger
 * /anime_stats:
 *   get:
 *     summary: Get anime statistics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Anime statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bool:
 *                   type: boolean
 *                 totalAnimes:
 *                   type: number
 *                 totalSeries:
 *                   type: number
 *                 totalMovies:
 *                   type: number
 *       403:
 *         description: Admin access required
 */
router.get('/anime_stats', refreshToken, validateAdmin, handleGetAnimeStats)

/**
 * @swagger
 * /viewed_analytics:
 *   get:
 *     summary: Get viewing analytics for all animes (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Viewing analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bool:
 *                   type: boolean
 *                 analytics:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       animeId:
 *                         type: string
 *                       name:
 *                         type: string
 *                       cover_image:
 *                         type: string
 *                       big_image:
 *                         type: string
 *                       avg_rating:
 *                         type: number
 *                       viewerCount:
 *                         type: number
 *                       type:
 *                         type: string
 *       403:
 *         description: Admin access required
 */
router.get('/viewed_analytics', refreshToken, validateAdmin, handleGetViewedAnalytics)

/**
 * @swagger
 * /online_users:
 *   get:
 *     summary: Get all online users details (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Online users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bool:
 *                   type: boolean
 *                 onlineUsers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       type:
 *                         type: string
 *                       loginTime:
 *                         type: number
 *       403:
 *         description: Admin access required
 */
router.get('/online_users', refreshToken, validateAdmin, handleGetOnlineUsers)

/**
 * @swagger
 * /user_profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bool:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Authentication required
 */
router.get('/user_profile', refreshToken, handleGetUserProfile)

/**
 * @swagger
 * /edit_profile:
 *   put:
 *     summary: Edit user profile
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profile_image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Authentication required
 */
router.put('/edit_profile', refreshToken, handleEditProfile)

/**
 * @swagger
 * /all_users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: All users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bool:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       403:
 *         description: Admin access required
 */
router.get('/all_users', refreshToken, validateAdmin, handleGetAllUsers)

/**
 * @swagger
 * /download_csv:
 *   get:
 *     summary: Download training data CSV (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: CSV file downloaded successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Admin access required
 */
router.get('/download_csv', refreshToken, validateAdmin, handleDownloadCSV)

module.exports = router;