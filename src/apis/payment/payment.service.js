const UserService = require('../user/user.service');
const Logger = require('@/libs/common/logger.service');
const { getPhoneFromCassoDes } = require('@/utils/common.utils');
const PaymentRepository = require('./payment.repository');
const { BadRequest } = require('@/libs/errors');
const { createRechargeOptionForUser } = require('@/utils/teamplate.utils');
const { sendMail } = require('@/libs/mail/mail');
const { sendRechargeEmail } = require('./payment.email');

class PaymentService {
	constructor() {
		this.paymentRepository = new PaymentRepository();
		this.userService = new UserService();
	}
	async createRefundPayment(order = {}) {
		const { orderId, user: realUser = {}, moneyPay } = order;
		const paymentInfo = {
			tid: orderId,
			amount: moneyPay,
			paymentType: 'refund',
			description: `refund order: ${orderId} user:${realUser._id} with amount:${moneyPay}`,
		};
		return this.createPayment(paymentInfo, realUser);
	}
	async createRechargePayment(paymentInfo) {
		Logger.writeLog('info', {
			message: 'user recharge start',
			...paymentInfo,
		});
		const { description, amount } = paymentInfo;
		const phone = getPhoneFromCassoDes(description);
		if (!phone) {
			Logger.writeLog('error', {
				message: 'Not phone exist',
				description,
			});
			throw new BadRequest('i');
		}
		const realUser = await this.userService.getUser({ phone });
		if (!realUser) {
			Logger.writeLog('error', {
				message: 'user recharge fail phone or user not found',
				description,
				amount,
			});
			throw new BadRequest('user_not_found');
		}
		return await this.createPayment(paymentInfo, realUser);
	}
	async createPayment(paymentInfo, realUser) {
		const {
			description,
			amount,
			tid: paymentId,
			paymentType = 'recharge',
		} = paymentInfo;
		const { _id: userId } = realUser;
		Logger.writeLog('info', {
			message: 'user nap tien',
			userId,
			amount,
			paymentId,
			description,
		});
		//create payment
		const newPayment = await this.paymentRepository.createNewPayment({
			paymentId,
			userId,
			info: paymentInfo,
			amount,
			paymentType,
		});

		if (!newPayment) {
			Logger.writeLog('error', {
				message: 'false create payment',
				userId,
				amount,
				paymentId,
				description,
			});
			throw new BadRequest('create payment fail');
		}
		Logger.writeLog('info', {
			message: 'success create payment',
			paymentId,
			userId,
		});

		// updateUserBalance
		const { userUpdated } = await this.userService.updateUserBalance(
			userId,
			amount
		);

		if (!userUpdated) {
			Logger.writeLog('error', {
				message: 'error update user balance',
				userId,
				amount,
				paymentId,
				description,
			});
			await this.paymentRepository.updatePayment(
				{ paymentId, userId },
				{ state: 'fail' }
			);
			throw new BadRequest();
		}
		Logger.writeLog('info', {
			message: 'success update user balance',
			paymentId,
			userId,
		});
		//updateUserBalance
		const { paymentUpdated } = await this.paymentRepository.updatePayment(
			{ paymentId, userId },
			{ state: 'success' }
		);
		if (!paymentUpdated) {
			Logger.writeLog('error', {
				message: 'error update payment state',
				userId,
				amount,
				paymentId,
				description,
			});
			throw new BadRequest();
		}
		Logger.writeLog('info', {
			message: 'success update payment',
			paymentId,
			userId,
		});

		// const shopOption = {
		// 	subject: 'Thông báo từ Airpot',
		// 	text: `User ${realUser?._id} da nap tien vao he thong cua ban voi so tien  ${payment?.amount} ma giao dich ${payment?.paymentId} luc ${payment?.createdAt}`,
		// };
		sendRechargeEmail(realUser, paymentUpdated).catch();
		// await sendMailForShopAndUser(shopOption, userOption);

		return { success: true, user: realUser, payment: paymentUpdated };
	}
	async getPaymentPerPage({
		currentPage,
		pageSize,
		dateFrom,
		dateTo,
		userId,
		// sort,
	}) {
		let query = {};
		let limit = pageSize || 20;
		let page = currentPage || 1;
		// let currentSort = null;
		// if (sort) {
		// 	let sortValue = {
		// 		desc: 1,
		// 		asc: -1,
		// 	};
		// 	currentSort = {
		// 		createdAt: sortValue[sort],
		// 	};
		// }
		const populate = {
			path: 'userId',
			select: 'first_name last_name',
		};
		if (userId) {
			query.userId = userId;
		}
		// if (orderId) {
		// 	query.orderId = {
		// 		$regex: orderId,
		// 		$options: 'i',
		// 	};
		// }
		if (dateFrom && dateTo) {
			query.createdAt = {
				$gte: new Date(dateFrom),
				$lte: new Date(dateTo),
			};
		}
		// if (status) {
		// 	const arrayStatus = status.split(' ');
		// 	query.state = {
		// 		$in: arrayStatus,
		// 	};
		// }
		const { pageInfo, data } = await this.paymentRepository.findPayments({
			query,
			page,
			limit,
			populate,
		});
		return {
			data,
			pageInfo,
			success: true,
		};
	}
	async getAllPaymentByAdmin(queryObject) {
		return await this.getPaymentPerPage(queryObject);
	}
	async getPaymentsByUser(userId, queryObject) {
		return await this.getPaymentPerPage({ ...queryObject, userId });
	}

	async updatePayment() {
		return {
			success: true,
		};
	}
}

module.exports = PaymentService;
