const { getTransporter } = require('@/configs/mail.config');
const Logger = require('../common/logger.service');
const { getShopInfo } = require('../common/shopInfo');

class MailLib {
	static async sendMail(mailOptions) {
		try {
			if (!mailOptions.to) throw new Error('email send to not Exist');
			const res = await getTransporter().sendMail(mailOptions);
			Logger.writeLog('info', {
				message: 'send mail',
				accepted: res?.accepted,
				rejected: res?.rejected,
			});
			return res;
		} catch (error) {
			Logger.writeLog('error', {
				message: 'send Mail false',
				reason: error.message,
			});
		}
	}
	static async sendMailForShop(mailOptions) {
		try {
			const shopInfo = getShopInfo();
			if (!shopInfo?.emails) throw new Error('email not found');
			mailOptions.to = shopInfo?.emails;
			const res = await getTransporter().sendMail(mailOptions);
			Logger.writeLog('info', {
				message: 'send mail for shop',
				accepted: res?.accepted,
				rejected: res?.rejected,
			});
			return res;
		} catch (error) {
			Logger.writeLog('error', { message: error.message });
		}
	}
	static async sendMailForShopAndUser(shopOption, userOption) {
		try {
			return await Promise.all([
				MailLib.sendMailForShop(shopOption),
				MailLib.sendMail(userOption),
			]);
		} catch (error) {
			Logger.writeLog('error', { message: error.message });
		}
	}
}
module.exports = MailLib;
