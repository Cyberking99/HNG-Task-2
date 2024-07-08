const express = require('express');
const userController = require('../controllers/userController');
const { authenticate } = require('../utils/auth');
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/users/:id', authenticate, userController.getUser);

module.exports = router;