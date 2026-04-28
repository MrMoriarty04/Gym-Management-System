const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getUser, updateUser, deleteUser,getCoachTrainees,forgotPassword ,resetPassword} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
//should be above router.get('/:id'
router.get('/my-trainees', protect, authorize('Coach'), getCoachTrainees);

router.get('/:id', protect, getUser);

router.put('/:id', protect, updateUser);

router.delete('/:id', protect, authorize('Admin'), deleteUser);

module.exports = router;