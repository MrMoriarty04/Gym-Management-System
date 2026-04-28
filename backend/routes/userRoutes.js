const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { authorized } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/:id',authorized, getUser);
router.put('/:id',authorized, updateUser);
router.delete('/:id',authorized, deleteUser);

module.exports = router;