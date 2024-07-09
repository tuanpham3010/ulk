const express = require('express');
const paymentController = require('./payment.controller');
const { asyncHandle } = require('@/utils/auth.utils');
const {
	getAllPaymentByAdmin,
	getPaymentsByUser,
	createPayment,
	updatePayment,
} = paymentController;
const paymentRouter = express.Router();

paymentRouter.get('/payment/all', asyncHandle(getAllPaymentByAdmin));
paymentRouter.get('/payment/user', asyncHandle(getPaymentsByUser));
paymentRouter.post('/payment', asyncHandle(createPayment));
paymentRouter.put('/payment', asyncHandle(updatePayment));

module.exports = paymentRouter;
