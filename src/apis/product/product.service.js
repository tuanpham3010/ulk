const ProductRepository = require('./product.repository');
const Product = require('./product.model');
const { BadRequest } = require('@/libs/errors');
// const ServiceType = require('../serviceType/serviceType.model');
const Network = require('../network/network.model');
const { createProductSchema } = require('./product.validate');
const { ADMIN_ROLE, USER_ROLE } = require('@/common/const/app.const');

class ProductService {
	constructor() {
		this.productRepository = new ProductRepository();
	}

	async createProduct({
		title,
		code,
		estimated_time,
		description,
		price,
		brand,
		show_home,
		status,
		isAuto,
		serviceAutoId,
	}) {
		const product = {
			title,
			code,
			estimated_time,
			description,
			price,
			brand,
			show_home,
			status,
			isAuto,
			serviceAutoId,
		}; // image,
		const { error } = createProductSchema.validate(product);
		if (error) throw new BadRequest('product invalid');
		const network = await Network.findById(brand).lean();
		// if (!productType) throw new BadRequest('ServiceType Not found');
		if (!network) throw new BadRequest('Network Not found');
		return {
			success: true,
			data: await ProductRepository.createNewProduct(product),
		};
	}
	async deleteProduct(productId) {
		if (!productId) throw new BadRequest('not productId');
		await Product.findByIdAndDelete(productId).lean();
		return {
			success: true,
			message: 'delete_success',
			data: { productId },
		};
	}
	async updateProduct(id, product) {
		// let validationUser = UserValidate.createUserSchema.validate(user);
		// if (validationUser.error) {
		// 	console.log('validationUser createUser ', validationUser);
		// 	throw new BadRequest('User not validate. Cannot register!');
		// }

		const { brand, isAuto, serviceAutoId } = product;
		// const [servicetype, network] = await Promise.all([
		// 	ServiceType.findOne({
		// 		name: type,
		// 	}),
		// 	Network.findOne({
		// 		title: brand,
		// 	}),
		// ]);
		const network = await Network.findOne({
			title: brand,
		});
		if (isAuto && !serviceAutoId) {
			throw new BadRequest('serviceAutoId is require when Auto');
		} // if (!servicetype) throw new BadRequest('serviceType is not valid');
		if (!network) throw new BadRequest('network is not valid');
		const updateProduct = await Product.findByIdAndUpdate(
			id,
			{
				...product,
				brand: network._id,
			},
			{
				upsert: true,
			}
		);
		if (!updateProduct) {
			throw new BadRequest('Cannot update product');
		}
		const updateProductResponseData = {
			success: true,
			product: updateProduct,
		};

		return updateProductResponseData;
	}
	async getAProduct(id, role) {
		const query = { _id: id };
		if (role !== ADMIN_ROLE) query.status = true;
		const product = await Product.findOne(query)
			.populate([{ path: 'brand', select: 'title' }])
			.lean();
		if (!product) {
			throw new BadRequest('Error get product!');
		}
		const productResponseData = {
			success: true,
			data: { ...product, id: product._id },
		};

		return productResponseData;
	}
	async getAllProduct(query) {
		return await this.getProductFilter(query);
	}
	async getProductFilter(
		{ show_home, network, title, pageSize, currentPage },
		initQuery = {}
	) {
		const query = initQuery;
		let limit = pageSize || 20;
		let page = currentPage || 1;
		const populate = [
			// { path: 'type', select: 'name' },
			{ path: 'brand', select: 'title' },
		];
		const booleanString = {
			TRUE: true,
			FALSE: false,
		};
		if (show_home) {
			booleanString[show_home] &&
				(query.show_home = booleanString[show_home]);
		}
		if (network) {
			query.brand = network;
		}
		if (title) {
			query.title = {
				$regex: title,
				$options: 'i',
			};
		}
		return {
			success: true,
			...(await ProductRepository.findProducts({
				query,
				populate,
				limit,
				page,
			})),
		};
	}
	async getCode() {
		const products = await Product.find({}).lean();
		return {
			success: true,
			data: products.map(({ code, title }) => {
				return { code, title };
			}),
		};
	}
}

module.exports = ProductService;
