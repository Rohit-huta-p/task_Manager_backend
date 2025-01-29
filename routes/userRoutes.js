const { signup, login, fetch_user_details } = require('../controllers/userController');
const { verifyToken } = require('../utils/verifyToken');

const router = require('express').Router();


/**
 * @file userRoutes.js
 * @description This file contains the routes for user authentication and management.
 * It defines endpoints for user signup, login, and fetching user details.
 *
 * Routes:
 * - POST /signup: Allows new users to register.
 * - GET /login: Handles user login.
 * - GET /fetch_user_details: Retrieves details of a specific user.
 *
 */

router.post('/signup', signup);
router.post('/login', login);
router.post('/fetch_user_details', verifyToken ,fetch_user_details);

module.exports = router;