const OrderRepository = require('./order.repository');
const Order = require('./order.model');
const { BadRequest, NotFoundException } = require('@/libs/errors');

const { isObjectId } = require('@/utils/common.utils');
const Logger = require('@/libs/common/logger.service');
const UserRepository = require('../user/user.repository');
const UserService = require('../user/user.service');
const { shopInfoService } = require('../shopInfo/shopInfo.controller');
const CommonUtils = require('@/utils/common.utils');
const { paymentService } = require('../payment/payment.controller');

const Product = require('../product/product.model');
const { getShopInfo } = require('@/libs/common/shopInfo');
const QueryString = require('@/utils/queryString.util');
const {
	sendMailCompleteOrder,
	sendMailNewOrder,
	sendNotifyOrderPendingForAdmin,
} = require('./order.email');
const CronJob = require('@/libs/cronJob/cronJob');
class OrderService {
	constructor() {
		this.orderRepository = new OrderRepository();
		this.UserRepository = new UserRepository();
		this.UserService = new UserService();
		const repeatTimeEachSecond = '0 0 * * * *';
		// const repeatTimeEachSecond = '*/10 * * * * *';
		CronJob.createCronJobWithTask(repeatTimeEachSecond, () => {
			sendNotifyOrderPendingForAdmin();
		});
	}
	async createOrder(order) {
		// let validationUser = UserValidate.createUserSchema.validate(user);
		// if (validationUser.error) {
		// 	console.log('validationUser createUser ', validationUser);
		// 	throw new BadRequest('User not validate. Cannot register!');
		// }
		if (!order.info) throw new BadRequest('info require');
		const { user, service } = order;
		//check service
		const [realService, realUser] = await Promise.all([
			Product.findOne({
				status: true,
				_id: service,
			})
				.populate('brand')
				.lean(),
			this.UserRepository.findAUserById(user),
		]);

		if (!realService) throw new NotFoundException('Service not found');
		if (!realUser) throw new NotFoundException('User not found');

		if (realService.price > realUser.balance) {
			Logger.writeLog('warn', {
				realUser,
				realService,
				message: 'not enough money',
			});
			throw new BadRequest('not enough money');
		}

		const { data: shopUpdated } =
			await shopInfoService.increaseOrderCount();
		if (!shopUpdated) throw new BadRequest('fail update shop');
		const orderId = CommonUtils.generateId(shopUpdated.orderCount);
		const moneyPay = realService.price;

		// create order
		Logger.writeLog('info', {
			user,
			service,
			message: 'create order start',
		});
		const newOrder = new Order({
			user,
			service,
			paymentStatus: 'success',
			moneyPay,
			info: order.info,
			orderId,
			autoOrderId: `${shopUpdated.orderCount}`,
			autoState: realService.isAuto ? 'pending' : 'none',
		});
		const createdOrder = await newOrder.save();
		if (!createdOrder) {
			Logger.writeLog('error', {
				realUser,
				realService,
				message: 'fail create order',
			});
			throw new BadRequest('Cannot create order');
		}
		Logger.writeLog('info', {
			orderId,
			message: 'create order success',
		});
		// giao dich
		if (createdOrder.state !== 'fail') {
			const { userUpdated } = await this.UserService.updateUserBalance(
				user,
				-moneyPay
			);
			if (!userUpdated) {
				Logger.writeLog('error', {
					orderId,
					message: 'fail to update balance user',
				});
				await Order.findOneAndUpdate(
					{ orderId },
					{ paymentStatus: 'fail' },
					{ new: true }
				);
				throw new BadRequest('fail to update balance user');
			}
			Logger.writeLog('info', {
				orderId,
				message: 'success pay for order',
			});

			Logger.writeLog('info', {
				orderId,
				message: 'success update paymentStatus of order',
			});
		}
		const createOrderResponseData = {
			success: true,
			data: newOrder,
		};
		sendMailNewOrder(realUser, createdOrder, realService);

		this.handleUpdateAutoOrder({
			service: realService,
			orderId,
			[order.info.type]: order.info.value,
		}).catch();
		return createOrderResponseData;
	}
	async sendImeiService({ service = {}, imei = '' }) {
		const resultNotAuto = { update: false };
		try {
			if (!imei) return resultNotAuto;
			if (!service.isAuto) return resultNotAuto;
			if (!service.serviceAutoId) return resultNotAuto;
			const { tokenImeiApi } = getShopInfo();
			if (!tokenImeiApi) return resultNotAuto;
			const url = `${process.env.API_IMEI}${QueryString.stringify({
				service_id: service.serviceAutoId,
				imei,
				token: tokenImeiApi,
			})}`;
			const res = await fetch(url);
			const data = await res.json();
			Logger.writeLog('info', {
				message: `fail to handle auto service url:${url}`,
				...data,
			});
			if (data.error_code) {
				Logger.writeLog('error', {
					message: `fail to handle auto service url:${url}`,
					...data,
				});
				return {
					update: true,
					payload: {
						autoResponse: data,
						autoState: 'fail',
					},
				};
			}
			if (data.status_display === 'Rejected') {
				Logger.writeLog('info', {
					message: `service auto reject by url:${url}`,
					...data,
				});
				return {
					update: true,
					payload: {
						autoResponse: data,
						autoState: 'fail',
						autoOrderId: data.id,

						// state:'success'
					},
				};
			}
			if (data.status_display === 'Done') {
				Logger.writeLog('info', {
					message: `service auto success by url:${url}`,
					...data,
				});
				return {
					update: true,
					payload: {
						autoResponse: data,
						autoOrderId: data.id,
						autoState: 'success',
						state: 'success',
						result: {
							resultMessage: 'Kết quả đơn hàng',
							resultText: data.response,
						},
					},
				};
			}
		} catch (error) {
			Logger.writeLog('error', {
				message: error.message,
			});
			return resultNotAuto;
		}
	}
	async handleUpdateAutoOrder({ service, orderId, imei }) {
		const { update, payload } = await this.sendImeiService({
			service,
			imei,
		});
		if (update) {
			await this.completeOrderByAuto(orderId, payload);
		}
	}
	async deleteOrderByAdmin({ orderId }) {
		const query = isObjectId(orderId) ? { _id: orderId } : { orderId };
		const { deletedCount } = await Order.deleteOne(query);
		if (deletedCount < 1) throw new BadRequest('delete_fail');
		Logger.writeLog('info', { message: 'delete order', ...query });
		return { success: true, message: 'success' };
	}
	async completeOrderByAuto(id, payload) {
		const populate = [
			{ path: 'user', select: 'first_name last_name email' },
			{ path: 'service', populate: { path: 'brand' } },
		];
		if (!id) return;
		const query = {
			orderId: id,
			paymentStatus: 'success',
			atuoState: 'pending',
			state: 'pending',
		};
		if (payload.state === 'success') {
			payload.endTime = Date.now();
		}
		const orderUpdated = await Order.findOneAndUpdate(query, payload, {
			new: true,
		})
			.populate(populate)
			.lean();
		if (!orderUpdated) throw new BadRequest('can not completeOrder order');

		sendMailCompleteOrder(
			orderUpdated.user,
			orderUpdated,
			orderUpdated.service
		).catch();

		return { success: true, data: orderUpdated };
	}
	async completeOrderByAdmin(id, payload) {
		const populate = [
			{ path: 'user', select: 'first_name last_name email' },
			{ path: 'service', populate: { path: 'brand' } },
		];
		if (!payload.result?.resultMessage) {
			throw new BadRequest('require_message');
		}
		if (!id) throw new NotFoundException('Order not found');
		const query = {
			orderId: id,
			// paymentStatus: 'success',
			state: 'pending',
		};
		const currentOrder = await Order.findOne(query).populate('user').lean();
		if (!currentOrder) throw new BadRequest('order_not_found');
		const isRefunded =
			!currentOrder.isRefund &&
			payload.isRefund &&
			payload.state !== 'success';
		if (isRefunded) {
			//refund
			const { success = false } =
				await paymentService.createRefundPayment(currentOrder);
			if (!success) throw new BadRequest('refund not success');
			Logger.writeLog('info', {
				message: 'refund success for order',
				order: currentOrder,
			});
		} else delete payload.isRefund;

		const orderUpdated = await Order.findOneAndUpdate(
			query,
			{
				...payload,
				endTime: Date.now(),
			},
			{
				new: true,
			}
		)
			.populate(populate)
			.lean();
		if (!orderUpdated) throw new BadRequest('can not completeOrder order');

		sendMailCompleteOrder(
			orderUpdated.user,
			orderUpdated,
			orderUpdated.service
		);

		return { success: true, data: orderUpdated };
	}

	async updateOrder(id, order = {}) {
		const query = { orderId: id };
		delete order.isRefund;
		const payload = order;
		const orderUpdated = await OrderRepository.updateOrder({
			query,
			payload,
		});
		const responseData = {
			success: true,
			data: orderUpdated,
		};
		return responseData;
	}

	//get
	async getAOrder(id) {
		// let validationUser = UserValidate.createUserSchema.validate(user);
		// if (validationUser.error) {
		// 	console.log('validationUser createUser ', validationUser);
		// 	throw new BadRequest('User not validate. Cannot register!');
		// }
		const query = isObjectId(id) ? { _id: id } : { orderId: id };
		const populate = [
			{
				path: 'user',
				select: 'first_name last_name phone email',
			},
			{
				path: 'service',
				select: 'title type description price',
			},
		];
		const order = await OrderRepository.findAOrder({ query, populate });

		if (!order) {
			throw new BadRequest('Error get order!');
		}
		const orderResponseData = {
			success: true,
			data: order,
		};
		return orderResponseData;
	}
	async getAllOrder() {
		return await this.getOrdersPerPage({});
	}
	async getOrdersByUserId(userId, queryObject) {
		const query = {
			...queryObject,
			user: userId,
		};
		return await this.getOrdersPerPage(query);
	}
	async getUserOrdersPerPage({
		currentPage,
		pageSize,
		orderId,
		dateFrom,
		dateTo,
		status,
		user,
		serviceCode,
	}) {
		let query = {};
		let limit = pageSize || 20;
		let page = currentPage || 1;
		const populate = [
			{ path: 'user', select: 'first_name last_name' },
			{
				path: 'service',
				select: 'title description code',
			},
		];
		if (user) {
			query.user = user;
		}
		if (orderId) {
			query.orderId = {
				$regex: orderId,
				$options: 'i',
			};
		}
		if (dateFrom && dateTo) {
			query.createdAt = {
				$gte: new Date(dateFrom),
				$lte: new Date(dateTo),
			};
		}
		if (serviceCode) {
			const listCode = Array.isArray(serviceCode)
				? serviceCode
				: [serviceCode];
			const currentService = await Product.find({
				code: {
					$in: listCode,
				},
			}).lean();
			query.service = {
				$in: currentService.map(({ _id }) => {
					return _id;
				}),
			};
		}
		if (status) {
			const arrayStatus = status.split(' ');
			query.state = {
				$in: arrayStatus,
			};
		}
		const { pageInfo, data } = await OrderRepository.findOrders({
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
	async getOrdersPerPage({
		currentPage,
		pageSize,
		orderId,
		dateFrom,
		dateTo,
		status,
		user,
		serviceCode,
	}) {
		let query = {};
		let limit = pageSize || 20;
		let page = currentPage || 1;
		const populate = [
			{ path: 'user', select: 'first_name last_name' },
			{
				path: 'service',
				select: 'title description code isAuto ',
			},
		];
		if (user) {
			query.user = user;
		}
		if (orderId) {
			query.orderId = {
				$regex: orderId,
				$options: 'i',
			};
		}
		if (dateFrom && dateTo) {
			query.createdAt = {
				$gte: new Date(dateFrom),
				$lte: new Date(dateTo),
			};
		}
		if (serviceCode) {
			const listCode = Array.isArray(serviceCode)
				? serviceCode
				: [serviceCode];
			const currentService = await Product.find({
				code: {
					$in: listCode,
				},
			}).lean();
			query.service = {
				$in: currentService.map(({ _id }) => {
					return _id;
				}),
			};
		}
		if (status) {
			const arrayStatus = status.split(' ');
			query.state = {
				$in: arrayStatus,
			};
		}
		const { pageInfo, data } = await OrderRepository.findOrders({
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
}

module.exports = OrderService;
