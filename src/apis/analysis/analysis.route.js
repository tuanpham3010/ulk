const express = require('express');
const AnalystController = require('./analysis.controller');
const { asyncHandle } = require('@/utils/auth.utils');
const AnalystRouter = express.Router();

AnalystRouter.get(
	'/analyst/admin/all',
	asyncHandle(AnalystController.getAnalystData)
);
AnalystRouter.get(
	'/analyst/user/order-count',
	asyncHandle(AnalystController.getCountOrderByUser)
);
AnalystRouter.get(
	'/analyst/user/money',
	asyncHandle(AnalystController.getMoneyUsedByUser)
);

module.exports = AnalystRouter;
