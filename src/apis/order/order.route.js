const express = require('express');
const orderController = require('./order.controller');
const { asyncHandle } = require('@/utils/auth.utils');

const orderRouter = express.Router();
orderRouter.get('/all-order', asyncHandle(orderController.getAllOrder));
// orderRouter.get('/order-used', asyncHandle(orderController.getMoneyUsedByUser));
// orderRouter.get(
// 	'/order/count-admin',
// 	asyncHandle(orderController.getCountOrderByAdmin)
// );
// orderRouter.get(
// 	'/order/count-user',
// 	asyncHandle(orderController.getCountOrderByUser)
// );
orderRouter.get(
	'/ordersPerPage',
	asyncHandle(orderController.getOrdersPerPage)
);
orderRouter.get(
	'/orders/user',
	asyncHandle(orderController.getUserOrdersPerPage)
);

orderRouter.get('/order/:id', asyncHandle(orderController.getAOrder));
orderRouter.get(
	'/user/order/:userId',
	asyncHandle(orderController.getOrdersByUserId)
);
orderRouter.put('/order/:id', asyncHandle(orderController.updateOrder));
orderRouter.patch(
	'/order/complete/:id',
	asyncHandle(orderController.completeOrderByAdmin)
);
orderRouter.post('/order', asyncHandle(orderController.createOrder));
orderRouter.delete(
	'/order/:orderId',
	asyncHandle(orderController.deleteOrderByAdmin)
);

module.exports = orderRouter;
