const { pagination } = require('@/utils/pagination.utils');
const Order = require('./order.model');
class OrderRepository {
	static async findAOrder({ query, populate = '', select = '' }) {
		return Order.findOne(query).populate(populate).select(select).lean();
	}

	// static async findOrders({
	// 	query = {},
	// 	sort = { updateAt: -1 },
	// 	skip = 0,
	// 	limit = 20,
	// 	select = '',
	// }) {
	// 	return await Order.find(query)
	// 		.sort(sort)
	// 		.skip(skip)
	// 		.limit(limit)
	// 		.select(select)
	// 		.lean()
	// 		.populate('user', 'first_name last_name') // Nạp thông tin user và chỉ lấy trường "first_name" và "last_name"
	// 		.populate('service', 'title') // Nạp thông tin product và chỉ lấy trường "title"
	// 		.exec();
	// }

	static async findOrders({
		query = {},
		sort = { createdAt: -1 },
		page = '',
		limit = '',
		select = '',
		populate = [],
	}) {
		return await pagination({
			Model: Order,
			query,
			sort,
			page,
			limit,
			populate,
			select,
		});
	}
	static async updateOrder({ query, payload, isNew = true, populate = '' }) {
		const updated = await Order.findOneAndUpdate(query, payload, {
			new: isNew,
		})
			.populate(populate)
			.lean();
		return updated;
	}
	static async deleteOrder(id) {
		const deleteOrder = await Order.deleteOne({ orderId: id });
		return deleteOrder;
	}
	static async getOrderCount(query) {
		const orderCount = await Order.countDocuments(query);
		return orderCount;
		//"64ac01a484ceaa9a86479ad8"
	}
}
module.exports = OrderRepository;
