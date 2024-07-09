const { stringToObjectId } = require('@/utils/object.utils');
const ProductService = require('./product.service');
class ProductController {
	constructor() {
		this.productService = new ProductService();
		this.getAProduct = this.getAProduct.bind(this);
		this.getAProductByAdmin = this.getAProductByAdmin.bind(this);
		this.getAllProduct = this.getAllProduct.bind(this);
		this.createProduct = this.createProduct.bind(this);
		this.updateProduct = this.updateProduct.bind(this);
		this.deleteProduct = this.deleteProduct.bind(this);
		this.getAvailableProduct = this.getAvailableProduct.bind(this);
		this.getCodeProduct = this.getCodeProduct.bind(this);
	}

	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async getAProduct(req, res) {
		const productId = stringToObjectId(req.params.productId);
		const data = await this.productService.getAProduct(
			productId,
		);
		res.json(data);
	}
	async getAProductByAdmin(req, res) {
		const productId = stringToObjectId(req.params.productId);
		const data = await this.productService.getAProduct(
			productId,
			req.body.userRole
		);
		res.json(data);
	}
	async getCodeProduct(req, res) {
		res.json(await this.productService.getCode());
	}
	async deleteProduct(req, res) {
		const productId = req.params.productId;
		res.status(200).json(
			await this.productService.deleteProduct(productId)
		);
	}
	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async getAllProduct(req, res) {
		const queryObj = req.query || {};
		const product = await this.productService.getAllProduct(queryObj);
		res.json(product);
	}
	async getAvailableProduct(req, res) {
		res.json(
			await this.productService.getProductFilter(req.query, {
				status: true,
			})
		);
	}
	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async createProduct(req, res) {
		const product = req.body;
		const productCreated = await this.productService.createProduct(product);
		res.json(productCreated);
	}

	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async updateProduct(req, res) {
		const productId = req.body.id || '1';
		const product = req.body;
		const productUpdated = await this.productService.updateProduct(
			productId,
			product
		);
		res.json(productUpdated);
	}
}

module.exports = new ProductController();
