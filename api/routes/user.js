const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/user');

// Handle Incoming request for User
router.get('/', UserController.getUserList);
router.post('/',UserController.registerUser);
router.post("/login",UserController.login);
router.get('/:userId',UserController.getUserById);
router.delete('/:userId',checkAuth, UserController.deleteUser);
router.patch('/:userId', checkAuth , UserController.updateUser);
// Get User by User Type : Student | Teacher | Admin
router.post('/getUserByType',UserController.getUserByType);

module.exports = router;