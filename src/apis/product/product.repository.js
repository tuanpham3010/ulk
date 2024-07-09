const { BadRequest } = require('@/libs/errors');
const Product = require('./product.model');
const { listMessage, errorCodes } = require('@/common/const/app.errorCode');
const { pagination } = require('@/utils/pagination.utils');

class ProductRepository {
	static async findAProductById(productId) {
		return await Product.findById(productId).populate(['brand']).lean();
	}
	static async createNewProduct(product) {
		try {
			return await Product.create(product);
		} catch (error) {
			if (error.name === 'MongoServerError' && error.code === 11000) {
				throw new BadRequest(
					listMessage.code_exit,
					errorCodes.code_exit
				);
			}
			throw new Error(error);
		}
	}
	static async findProducts({
		query = {},
		sort = { createdAt: -1 },
		page = '',
		limit = '',
		select = '',
		populate = [],
	}) {
		return await pagination({
			Model: Product,
			query,
			sort,
			page,
			limit,
			populate,
			select,
		});
	}
}
module.exports = ProductRepository;
// [{ path: 'type' }, { path: 'brand' }]
