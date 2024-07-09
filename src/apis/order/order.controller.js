const OrderService = require('./order.service.js');
class OrderController {
	constructor() {
		this.orderService = new OrderService();
		this.getAOrder = this.getAOrder.bind(this);
		this.getOrderFilter = this.getOrderFilter.bind(this);
		this.getAllOrder = this.getAllOrder.bind(this);
		this.getOrdersByUserId = this.getOrdersByUserId.bind(this);
		this.createOrder = this.createOrder.bind(this);
		this.updateOrder = this.updateOrder.bind(this);
		this.completeOrderByAdmin = this.completeOrderByAdmin.bind(this);
		// this.getCountOrderByAdmin = this.getCountOrderByAdmin.bind(this);
		// this.getIncomeInMonth = this.getIncomeInMonth.bind(this);
		this.getOrdersPerPage = this.getOrdersPerPage.bind(this);
		this.getUserOrdersPerPage = this.getUserOrdersPerPage.bind(this);
		// this.getIncomeInMonthByAdmin = this.getIncomeInMonthByAdmin.bind(this);
		// this.getCountOrderByUser = this.getCountOrderByUser.bind(this);
		this.deleteOrderByAdmin = this.deleteOrderByAdmin.bind(this);
	}

	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async getAOrder(req, res) {
		const orderId = req.params.id;
		const order = await this.orderService.getAOrder(orderId);
		res.json(order);
	}
	async getOrderFilter(req, res) {
		const order = await this.orderService.getOrderFilter(req.query);
		res.status(200).json(order);
	}

	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async getAllOrder(req, res) {
		const queryObj = req.query || {};
		const orders = await this.orderService.getAllOrder(queryObj);
		res.json({
			success: true,
			orders,
		});
	}
	async deleteOrderByAdmin(req, res) {
		const { orderId } = req.params;
		const { user } = req.body;
		res.status(200).json(
			await this.orderService.deleteOrderByAdmin({ orderId, user })
		);
	}

	async getOrdersByUserId(req, res) {
		const userId = req.params.userId;
		const allOrderOfUser = await this.orderService.getOrdersByUserId(
			userId,
			req.query
		);
		res.status(200).json(allOrderOfUser);
	}

	async completeOrderByAdmin(req, res) {
		const id = req.params.id;

		res.status(200).json(
			await this.orderService.completeOrderByAdmin(id, req.body)
		);
	}
	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async createOrder(req, res) {
		const order = req.body;
		const orderCreated = await this.orderService.createOrder(order);
		res.json(orderCreated);
		// const orderId = orderCreated?.data?.orderId;
		// const shopOption = {
		// 	subject: 'Thông báo từ Airpot',
		// 	text: `Bạn có đơn hàng mới mã đơn hàn ${orderId}`,
		// };
		// const userOption = {
		// 	to: req.body.email,
		// 	subject: 'Thông báo từ Airpot',
		// 	text: `Bạn đã tạo đơn hàng thành công với mã đơn hàng ${orderId}`,
		// };
		// await sendMailForShopAndUser(shopOption, userOption);
	}

	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async updateOrder(req, res) {
		const orderId = req.params.id;
		const order = req.body;
		const orderUpdated = await this.orderService.updateOrder(
			orderId,
			order
		);
		res.json(orderUpdated);
	}
	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async getOrdersPerPage(req, res) {
		res.json(await this.orderService.getOrdersPerPage(req.query));
	}
	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async getUserOrdersPerPage(req, res) {
		res.json(
			await this.orderService.getOrdersByUserId(req.body.user, req.query)
		);
	}
}

module.exports = new OrderController();
