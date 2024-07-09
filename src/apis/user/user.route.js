const express = require('express');
const userController = require('./user.controller');
const { asyncHandle } = require('@/utils/auth.utils');

const userRouter = express.Router();

userRouter.get('/dongtest', asyncHandle(userController.getDongtest));
userRouter.get('/user/all', asyncHandle(userController.getAllUser));
userRouter.get('/user/:id', asyncHandle(userController.getUserById));
userRouter.post('/user/create', asyncHandle(userController.createUser));
userRouter.put('/user/:id', asyncHandle(userController.updateUser));
userRouter.patch(
	'/user/reset-password/:token',
	asyncHandle(userController.resetPassword)
);
userRouter.post(
	'/user/forgot-password',
	asyncHandle(userController.forgotPassword)
);
userRouter.patch(
	'/user/password',
	asyncHandle(userController.changePasswordByUser)
);
userRouter.patch(
	'/user/admin-password',
	asyncHandle(userController.changePasswordByAdmin)
);

userRouter.delete('/user/delete/:id', asyncHandle(userController.deleteUser));
// disable by DongNV.
// userRouter.post('/user/create-admin', asyncHandle(userController.createAdmin));
userRouter.post('/auth/login', asyncHandle(userController.login));
userRouter.get('/auth/logout', asyncHandle(userController.logout));
userRouter.get('/current-user', asyncHandle(userController.getCurrentUser));
userRouter.get('/auth/token', asyncHandle(userController.token));
userRouter.post('/auth/login-admin', asyncHandle(userController.loginAdmin));

module.exports = userRouter;
