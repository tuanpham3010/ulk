const { BadRequest } = require('@/libs/errors');
const PaymentService = require('./payment.service');
const Logger = require('@/libs/common/logger.service');
const { getShopInfo } = require('@/libs/common/shopInfo');
class PaymentController {
	constructor() {
		this.paymentService = new PaymentService();
		this.createPayment = this.createPayment.bind(this);
		this.getAllPaymentByAdmin = this.getAllPaymentByAdmin.bind(this);
		this.getPaymentsByUser = this.getPaymentsByUser.bind(this);
	}
	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async createPayment(req, res) {
		const { cassoKey } = getShopInfo();
		const secretKey = req.headers['secure-token'];
		if (secretKey != cassoKey) throw new BadRequest('fail');
		try {
			const paymentInfo = req.body?.data[0];

			await this.paymentService.createRechargePayment(paymentInfo);
		} catch (error) {
			Logger.writeLog('error', {
				message: 'user nap tien',
				...error,
			});
		} finally {
			res.status(200).json({ success: true });
		}
	}
	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async updatePayment(req, res) {
		const paymentInfo = req.body;
		const paymentUpdated = await this.paymentService.updatePayment(
			paymentInfo
		);
		res.json(paymentUpdated);
	}
	async getAllPaymentByAdmin(req, res) {
		res.status(200).json(
			await this.paymentService.getAllPaymentByAdmin(req.query)
		);
	}
	async getPaymentsByUser(req, res) {
		res.status(200).json(
			await this.paymentService.getPaymentsByUser(
				req.body.user,
				req.query
			)
		);
	}
}

module.exports = new PaymentController();
