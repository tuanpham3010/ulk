const express = require('express');
const productController = require('./product.controller');
const { asyncHandle } = require('@/utils/auth.utils');

const productRouter = express.Router();

// productRouter.get(
// 	'/product/count',
// 	asyncHandle(productController.getCountProductByAdmin)
// );
productRouter.get(
	'/product-code',
	asyncHandle(productController.getCodeProduct)
);
productRouter.get(
	'/product-user/:productId',
	asyncHandle(productController.getAProduct)
);
//
productRouter.get(
	'/product-admin/:productId',
	asyncHandle(productController.getAProductByAdmin)
);
productRouter.get('/all-product', asyncHandle(productController.getAllProduct));
productRouter.get(
	'/product-available',
	asyncHandle(productController.getAvailableProduct)
);
productRouter.post('/product', asyncHandle(productController.createProduct));
productRouter.put('/product/', asyncHandle(productController.updateProduct));
productRouter.delete(
	'/product/:productId',
	asyncHandle(productController.deleteProduct)
);

module.exports = productRouter;
