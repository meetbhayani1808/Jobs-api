const express = require('express');
const router = express.Router();
const { register, login, updateUser } = require('../controllers/auth');
const authentication = require('../middleware/authentication');
const testUser = require('../middleware/testUser');

const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMS: 15 * 60 * 1000,
    max: 15,
    message: {
        msg: 'To many request from this ip address, please try again after 15 minutes',
    },
});

router.post('/register', apiLimiter, register);
router.post('/login', apiLimiter, login);
router.patch('/updateUser', authentication, testUser, updateUser);

module.exports = router;
