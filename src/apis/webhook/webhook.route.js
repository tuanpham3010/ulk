const express = require('express');
const { asyncHandle } = require('@/utils/auth.utils');
const webhookController = require('./webhook.controller');

const webhookRouter = express.Router();

// webhookRouter.post(
// 	'/webhook/order',
// 	asyncHandle(webhookController.listenWebhookOrder)
// );

// webhookRouter.post('/dong', asyncHandle(webhookController.dongtest));
// webhookRouter.get('/tuan', asyncHandle(webhookController.getGmailTest));
// webhookRouter.get('/history', asyncHandle(webhookController.getHistory));
webhookRouter.get('/webhook/imei', asyncHandle(webhookController.getImeiRes));
module.exports = webhookRouter;
