const express = require('express');
const networkController = require('./network.controller');
const { asyncHandle } = require('@/utils/auth.utils');

const NetworkRouter = express.Router();

NetworkRouter.get('/networks', asyncHandle(networkController.getAllNetwork));
NetworkRouter.post('/network', asyncHandle(networkController.createNetwork));
NetworkRouter.delete(
	'/network/:id',
	asyncHandle(networkController.deleteNetwork)
);
NetworkRouter.patch(
	'/network/:id',
	asyncHandle(networkController.updateNetwork)
);

module.exports = NetworkRouter;
