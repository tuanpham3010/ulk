const { formatDateToNumericString } = require('@/utils/common.utils');
const ShopInfoService = require('./shopInfo.service');
const fs = require('fs');
class shopInfoController {
	constructor() {
		this.shopInfoService = new ShopInfoService();
		this.getShopInfoByUser = this.getShopInfoByUser.bind(this);
		this.getShopInfo = this.getShopInfo.bind(this);
		this.updateBankInfo = this.updateBankInfo.bind(this);
		this.updateShop = this.updateShop.bind(this);
		this.generateQrCodeForUser = this.generateQrCodeForUser.bind(this);
		this.updateShopGmail = this.updateShopGmail.bind(this);
		this.getGmailOAUrl = this.getGmailOAUrl.bind(this);
		this.getBackupFile = this.getBackupFile.bind(this);
		this.getBackupToken = this.getBackupToken.bind(this);
	}

	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async getShopInfo(_, res) {
		const shopInfo = this.shopInfoService.getShopInfo();
		res.json(shopInfo);
	}
	async getShopInfoByUser(_, res) {
		const shopInfo = await this.shopInfoService.getShopInfoByUser();
		res.json(shopInfo);
	}
	async updateShop(req, res) {
		const shopInfo = await this.shopInfoService.updateShopInfo(req.body);
		res.json(shopInfo);
	}
	async updateBankInfo(req, res) {
		res.json(await this.shopInfoService.updateBankInfoByAdmin(req.body));
	}
	async generateQrCodeForUser(req, res) {
		res.json(await this.shopInfoService.generateQrCodeForUser(req.body));
	}
	async getGmailOAUrl(req, res) {
		res.json(await this.shopInfoService.getGmailOAUrl());
	}
	async updateShopGmail(req, res) {
		res.json(await this.shopInfoService.updateShopGmail(req.query));
	}
	async getBackupFile(req, res) {
		const { data } = await this.shopInfoService.getBackupJson(
			req.params.token
		);
		const backupFileName = `${formatDateToNumericString()}.json`;
		const filePath = 'backup/' + backupFileName;
		fs.writeFileSync(filePath, data, { flag: 'w' });
		res.status(200).download(filePath);
	}

	async getBackupToken(req, res) {
		res.json(await this.shopInfoService.createBackupToken());
	}
}

module.exports = new shopInfoController();
