const Logger = require('@/libs/common/logger.service');
const RedisLib = require('@/libs/database/redis');
const {
	sendMailForShopAndUser,
	sendMail,
	sendMailForShop,
} = require('@/libs/mail/mail');
const TeamplateUtils = require('@/utils/teamplate.utils');
const Order = require('./order.model');

class OrderEmail {
	createNewOrderOptionForAdmin(
		{ email },
		{ orderId, createdAt, moneyPay },
		{ brand = {}, code, title }
	) {
		const html = TeamplateUtils.createHtmlFromTemplate(
			'src/libs/mail/emailTemplate/newOrder.html',
			{
				// user_name: `${user.first_name} ${user.last_name}`,
				order_id: orderId,
				order_user: email,
				service_name: title,
				service_code: code,
				service_brand: brand.title,
				Order_createdAt: createdAt,
				total_payment: moneyPay,
			}
		);
		const mailOptions = {
			subject: TeamplateUtils.SUBJECT,
			html,
		};
		return mailOptions;
	}
	createFailOrderOptionForUser(
		{ first_name, last_name, email },
		{ orderId, createdAt, moneyPay, result = {} },
		{ brand, title, description, code }
	) {
		// console.log(result);
		const html = TeamplateUtils.createHtmlFromTemplate(
			'src/libs/mail/emailTemplate/orderFailed.html',
			{
				order_id: orderId,
				user_name: `${first_name} ${last_name}`,
				service_name: title,
				service_brand: brand.title,
				service_code: code,
				service_desc: TeamplateUtils.convertTextToHTML(description),
				Order_createdAt: createdAt,
				total_payment: moneyPay,
				order_message: TeamplateUtils.convertTextToHTML(
					result.resultMessage
				),
				// order_result: TeamplateUtils.convertTextToHTML(
				// 	result.resultText
				// ),
			}
		);
		const mailOptions = {
			subject: TeamplateUtils.SUBJECT,
			html,
			to: email,
		};
		return mailOptions;
	}
	createSuccessOrderOptionForUser(
		{ first_name, last_name, email },
		{ orderId, createdAt, moneyPay, result = {} },
		{ brand, title, description, code }
	) {
		const html = TeamplateUtils.createHtmlFromTemplate(
			'src/libs/mail/emailTemplate/orderSuccess.html',
			{
				order_id: orderId,
				user_name: `${first_name} ${last_name}`,
				service_name: title,
				service_brand: brand.title,
				service_code: code,
				service_desc: TeamplateUtils.convertTextToHTML(description),
				Order_createdAt: createdAt,
				total_payment: moneyPay,
				order_message: TeamplateUtils.convertTextToHTML(
					result.resultMessage
				),
				order_result: TeamplateUtils.convertTextToHTML(
					result.resultText
				),
			}
		);
		const mailOptions = {
			subject: TeamplateUtils.SUBJECT,
			html,
			to: email,
		};
		return mailOptions;
	}
	createNotifyOrderPendingForAdminOption = (listOrder = []) => {
		const listString = listOrder.map((item) => {
			return `<p>
			<strong>Mã đơn hàng: ${item.orderId}</strong>
			<br>
			Dịch vụ:${item.service?.title}
			</p>`;
		});
		const html = TeamplateUtils.createHtmlFromTemplate(
			'src/libs/mail/emailTemplate/ordePending.html',
			{
				order_count: listOrder.length,
				order_ids: listString.join('<br>'),
			}
		);
		return {
			subject: TeamplateUtils.SUBJECT,
			html,
		};
	};
	createNewOrderOptionForUser(
		{ first_name, last_name, email },
		{ orderId, createdAt, moneyPay },
		{ brand = {}, title, description, code }
	) {
		const html = TeamplateUtils.createHtmlFromTemplate(
			'src/libs/mail/emailTemplate/orderconfirm.html',
			{
				order_id: orderId,
				user_name: `${first_name} ${last_name}`,
				service_name: title,
				service_id: code,
				service_brand: brand.title,
				service_desc: TeamplateUtils.convertTextToHTML(description),
				Order_createdAt: createdAt,
				total_payment: moneyPay,
			}
		);
		const mailOptions = {
			subject: TeamplateUtils.SUBJECT,
			html,
			to: email,
		};
		return mailOptions;
	}

	sendMailNewOrder = async (realUser, createdOrder, realService) => {
		const shopOption = this.createNewOrderOptionForAdmin(
			realUser,
			createdOrder,
			realService
		);
		const userOption = this.createNewOrderOptionForUser(
			realUser,
			createdOrder,
			realService
		);
		RedisLib.addToOrderPendingToSet(createdOrder.orderId);
		sendMailForShopAndUser(shopOption, userOption).catch((error) => {
			Logger.writeLog('error', {
				message: 'sendMailForShopAndUser error',
				error,
			});
		});
	};
	sendMailCompleteOrder = async (user, order, service) => {
		let option = null;
		if (order.state === 'success') {
			option = this.createSuccessOrderOptionForUser(user, order, service);
		}
		if (order.state === 'fail') {
			option = this.createFailOrderOptionForUser(user, order, service);
		}
		if (option) {
			sendMail(option).catch(() => {});
			RedisLib.removeToOrderPendingToSet(order.orderId).catch(() => {});
		}
	};
	sendNotifyOrderPendingForAdmin = async () => {
		const listOrderId = await RedisLib.getToOrderPendingToSet();

		if (listOrderId.length) {
			const orders = await Order.find({ orderId: { $in: listOrderId } })
				.populate('service')
				.lean();
			const option = this.createNotifyOrderPendingForAdminOption(orders);
			sendMailForShop(option).catch(() => {});
		}
	};
}

module.exports = new OrderEmail();
