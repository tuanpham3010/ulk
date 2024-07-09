const express = require('express');
const shopController = require('./shopInfo.controller');
const { asyncHandle } = require('@/utils/auth.utils');

const shopRouter = express.Router();

shopRouter.patch('/shop/bank', asyncHandle(shopController.updateBankInfo)); //admin
shopRouter.put('/shop', asyncHandle(shopController.updateShop)); //admin
shopRouter.patch(
	'/shop/confirm-qr',
	asyncHandle(shopController.generateQrCodeForUser)
); //admin
shopRouter.get('/shop/admin', asyncHandle(shopController.getShopInfo)); //admin
shopRouter.get('/shop/gmail-url', asyncHandle(shopController.getGmailOAUrl)); //admin
shopRouter.get(
	'/shop/backup/:token',
	asyncHandle(shopController.getBackupFile)
); //admin
shopRouter.get(
	'/shop/backup-token',
	asyncHandle(shopController.getBackupToken)
); //admin

shopRouter.get('/shop/user', asyncHandle(shopController.getShopInfoByUser)); //white
shopRouter.get('/shop/gmail', asyncHandle(shopController.updateShopGmail)); //white

module.exports = shopRouter;
