const express = require('express');
const RoleController = require('./role.controller');

const authRouter = express.Router();

authRouter.get('/role/id', RoleController.getRoleId);
authRouter.get('/role/name', RoleController.getRoleName);

module.exports = authRouter;