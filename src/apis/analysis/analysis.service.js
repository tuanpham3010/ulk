const { BadRequest } = require('@/libs/errors');
const Order = require('../order/order.model');
const User = require('../user/user.model');
const Product = require('../product/product.model');

const getConditionSearchByType = (type) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0); // tạo ra thời điểm bắt đầu của ngày hôm nay

	const tomorrow = new Date(today); // Tạo một đối tượng Date mới với ngày hôm nay
	tomorrow.setDate(tomorrow.getDate() + 1); // Tăng ngày lên 1 để đến ngày mai

	const oneWeekAgo = new Date(today); // Tạo một đối tượng Date mới với ngày hiện tại
	oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Giảm ngày đi 7 để quay lại 1 tuần trước

	const oneMonthAgo = new Date(today); // Tạo một đối tượng Date mới với ngày hiện tại
	oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // Giảm đi 1 tháng để quay lại 1 tháng trước

	const threeMonthAgo = new Date(today); // Tạo một đối tượng Date mới với ngày hiện tại
	threeMonthAgo.setMonth(threeMonthAgo.getMonth() - 3); // Giảm đi 3 tháng để quay lại 3 tháng trước

	const sixMonthAgo = new Date(today); // Tạo một đối tượng Date mới với ngày hiện tại
	sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6); // Giảm đi 6 tháng để quay lại 6 tháng trước

	const oneYearAgo = new Date(today); // Tạo một đối tượng Date mới với ngày hiện tại
	oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1); // Giảm đi 1 năm để quay lại 1 năm trước
	const conditionObj = {
		today: {
			createdAt: {
				$gte: today,
				$lt: tomorrow,
			},
		},
		oneWeekAgo: {
			createdAt: {
				$gte: oneWeekAgo,
				$lt: today,
			},
		},
		oneMonthAgo: {
			createdAt: {
				$gte: oneMonthAgo,
				$lt: today,
			},
		},
		threeMonthAgo: {
			createdAt: {
				$gte: threeMonthAgo,
				$lt: today,
			},
		},
		sixMonthAgo: {
			createdAt: {
				$gte: sixMonthAgo,
				$lt: today,
			},
		},
		oneYearAgo: {
			createdAt: {
				$gte: oneYearAgo,
				$lt: today,
			},
		},
		allTime: {},
	};
	const condition = conditionObj[type];
	if (!condition) throw new BadRequest('condition invalid');
	return condition;
};

class AnalystService {
	async getAnalystData(timeToGet) {
		const conditionSearch = getConditionSearchByType(timeToGet);

		const newOrder = await Order.find({ ...conditionSearch });

		const newRegisterCount = await User.countDocuments({
			...conditionSearch,
			role: 'user',
		});

		const totalRevenue = newOrder.reduce((total, order) => {
			return total + order.moneyPay * 1;
		}, 0);

		const totalUser = await User.countDocuments({ role: 'user' });
		const totalService = await Product.countDocuments({});
		const pendingOrder = await Order.countDocuments({
			// ...conditionSearch,
			state: 'pending',
		});
		return {
			newOrderCount: newOrder.length,
			newRegisterCount,
			totalRevenue,
			totalUser,
			totalService,
			pendingOrder,
		};
	}
	async countOrder({ user, state }) {
		const query = {
			user,
			state,
		};
		return {
			success: true,
			data: {
				count: await Order.countDocuments(query),
			},
		};
	}
	async getMoneyUserUsed(user) {
		const orders = await Order.find({
			state: { $in: ['pending', 'success'] },
			isRefund: false,
			user,
			paymentStatus: 'success',
		});
		const moneyUsed = orders.reduce((current, item) => {
			return current + item.moneyPay;
		}, 0);
		return {
			success: true,
			data: {
				moneyUsed: moneyUsed,
			},
		};
	}
}

module.exports = AnalystService;
