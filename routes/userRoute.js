const express = require('express');
const {
    getUsers,
    getCurrentUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe,
    getUser
} = require('../controllers/userController');
const {
    signInUser,
    signUpUser,
    forgotPassword,
    resetPassword,
    updateCurrentUserPassword
} = require('../controllers/authController');
const { protectRoute, restrictTo } = require('../middlewares/authMiddleware');
const checkID = require('../utils/checkID');

const router = express.Router();

router.get('/', getUsers);
router.post('/signUp', signUpUser);
router.post('/signIn', signInUser);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword', protectRoute, updateCurrentUserPassword);
router.patch('/updateMe', protectRoute, updateMe);
router.get('/me', protectRoute, getCurrentUser);
router.delete('/deleteMe', protectRoute, deleteMe);

router
    .route('/:id')
    .get(
        protectRoute,
        restrictTo('admin'),
        getUser
    )
    .patch(
        protectRoute,
        restrictTo('admin'),
        updateUser
    )
    .delete(
        protectRoute,
        restrictTo('admin'),
        deleteUser
    );

module.exports = router;