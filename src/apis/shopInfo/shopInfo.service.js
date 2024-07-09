const Logger = require('@/libs/common/logger.service');
const ShopInfo = require('./shopInfo.model');
const listBankMap = require('@/common/const/app.banks');
const { BadRequest } = require('@/libs/errors');
const QrUtils = require('@/utils/qr.utils');
const User = require('../user/user.model');
const { USER_ROLE } = require('@/common/const/app.const');
const CommonUtils = require('@/utils/common.utils');
const { setShopInfo, getShopInfo } = require('@/libs/common/shopInfo');
const {
	getAuthorizationUrl,
	setGoogleGmail,
} = require('@/configs/googleApi.config');
const mongoose = require('mongoose');
const { RedisLib } = require('@/libs/database');
const SHOP_NAME = 'dongnv';
class ShopInfoService {
	constructor() {
		(async () => {
			let currentShop = null;
			try {
				currentShop = await ShopInfo.findOne({}).lean();
				if (!currentShop) {
					currentShop = await ShopInfo.create({
						emails: ['phamtuanhd3010@gmail.com'],
						name: SHOP_NAME,
					});
				}
				setShopInfo(currentShop);
			} catch (error) {
				Logger.writeLog('error', {
					message: 'ShopInfoService error',
					error,
				});
			}
		})();
	}
	getShopInfo() {
		return {
			data: getShopInfo(),
			success: true,
		};
	}
	async getShopInfoByUser() {
		const data = getShopInfo();
		const {
			banner,
			bankAccount,
			bankAccountName,
			bankBin,
			contactZalo,
			contactFacebook,
			contactTelegram,
			logoLink,
		} = data;
		return {
			data: {
				banner,
				bankAccount,
				bankAccountName,
				bankBin,
				bankName: listBankMap.get(`${bankBin}`)?.shortName,
				contactZalo,
				contactFacebook,
				contactTelegram,
				logoLink,
			},
			success: true,
		};
	}
	async increaseOrderCount() {
		const shopInfoUpdated = await ShopInfo.findOneAndUpdate(
			{},
			{ $inc: { orderCount: 1 } },
			{ new: true, runValidators: true }
		);

		return {
			success: true,
			data: shopInfoUpdated,
		};
	}

	async updateShopInfo(payload) {
		delete payload.balance;
		delete payload.bankBin;
		delete payload.bankAccount;
		delete payload.orderCount;
		const shopUpdated = await ShopInfo.findOneAndUpdate({}, payload, {
			new: true,
		});
		return {
			success: true,
			data: shopUpdated,
		};
	}

	async updateBankInfoByAdmin({ bankBin, bankAccount, bankAccountName }) {
		const bank = listBankMap.get(`${bankBin}`);
		if (!bank) throw new BadRequest('bankBin invalid');
		const qrBankShop = QrUtils.generateQr({
			bankBin,
			bankAccount,
			message: 'admincheck',
		});
		const payload = {
			bankBin,
			bankAccount,
			bankAccountName,
			qrBankShop,
		};
		const shopUpdated = await ShopInfo.findOneAndUpdate({}, payload, {
			new: true,
		}).lean();
		await User.updateMany({}, { $set: { qrCode: '' } });

		return {
			success: true,
			data: shopUpdated,
		};
	}
	async generateQrCodeForUser() {
		const listUser = await User.find({ role: USER_ROLE }).lean();
		const shopInfo = getShopInfo();
		if (!listUser?.[0]) throw new BadRequest('no user');
		if (!shopInfo) throw new BadRequest('no shop');
		if (!shopInfo?.bankAccount) {
			throw new BadRequest('no bankAccount');
		}
		if (!shopInfo?.bankBin) throw new BadRequest('no bankBin');
		const qrData = {
			bankAccount: shopInfo?.bankAccount,
			bankBin: shopInfo?.bankBin,
		};
		listUser.forEach(async (user) => {
			const message = CommonUtils.generateRechargeMessage(user.phone);
			const qrCode = QrUtils.generateQr({ ...qrData, message });
			await User.findByIdAndUpdate(user._id, { qrCode }, { new: true });
		});
		return {
			message: 'generate qr code',
			success: true,
		};
	}
	async updateShopBalance(moneyCount) {
		try {
			const shopInfoUpdated = await ShopInfo.findOneAndUpdate(
				{ name: SHOP_NAME },
				{ $inc: { balance: moneyCount } },
				{ new: true, runValidators: true }
			);

			return {
				success: true,
				shopInfoUpdated,
			};
		} catch (error) {
			Logger.writeLog('error', {
				message: 'updateShopBalance error',
				error,
			});
			throw new Error(error);
		}
	}
	async getGmailOAUrl() {
		try {
			const url = await getAuthorizationUrl();
			return {
				success: true,
				data: url,
			};
		} catch (error) {
			return {
				success: false,
				message: error,
			};
		}
	}
	async updateShopGmail({ code, scope }) {
		if (code && scope) {
			await ShopInfo.findOneAndUpdate(
				{},
				{
					gmailKey: code,
					gmailScope: scope,
				},
				{
					new: true,
				}
			);
			await setGoogleGmail(code);
			return {
				success: true,
				message: 'Gmail token updated',
			};
		}
		return {
			success: false,
			message: 'Some error. Try again or contact admin',
		};
	}
	async getBackupJson(token) {
		const currentToken = await RedisLib.getBackup();
		if (token !== currentToken) throw new BadRequest('token invalid');
		RedisLib.removeBackUp().catch();
		const jsonData = {};
		const listPromiseSetJsonData = mongoose.modelNames().map((name) => {
			const asyncFunc = async () => {
				jsonData[name] = await mongoose.model(name).find({}).lean();
			};
			return asyncFunc();
		});
		await Promise.all(listPromiseSetJsonData);

		return {
			success: true,
			data: JSON.stringify(jsonData),
		};
	}
	async createBackupToken() {
		const token = CommonUtils.randomString(10);
		await RedisLib.setBackup({ value: token, expire: 30 });
		return {
			success: true,
			data: token,
		};
	}
}

module.exports = ShopInfoService;
