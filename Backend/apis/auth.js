const express = require('express');
const router = express.Router();
const { validateSignup, validateLogin, refreshToken } = require('../middleware');
const  {
    handleAddUser,
    handleVerifyToken,
    handleLogin,
    handleFetchWishlist,
    handleToggleWishlist,
    handleLogout,
    sendCode,
    verifyCode
} = require('../controllers/auth')

router.post('/add_user',validateSignup,handleAddUser );


router.get('/verify_token',refreshToken, handleVerifyToken)

router.post('/sendOTP',sendCode)
router.post('/verifyOTP',verifyCode)

router.post('/login',validateLogin, handleLogin); 

router.post('/get_wishlist',refreshToken, handleFetchWishlist)

router.post('/toggle_wishlist',refreshToken,handleToggleWishlist)

router.get('/logout',refreshToken, handleLogout)

module.exports = router;