// const Logger = require('../libs/common/logger.service');

const { AppConsts } = require('@/common/const');
const { BadRequest, ServerError } = require('@/libs/errors');
// eslint-disable-next-line no-unused-vars
const { Request, Response, NextFunction } = require('express');
const UserService = require('@/apis/user/user.service');
const { getTypeRequest } = require('@/utils/middleware.utils');
const { TOKEN_TYPE } = require('@/common/const/app.key');

const listRefreshToken = [
	{ path: '/api/v1/auth/token', exact: true, method: 'GET' },
];
const whitelist = [
	//user
	{ path: '/api/v1/dongtest', exact: true, method: 'GET' },
	{ path: '/api/v1/user/create', exact: true, method: 'POST' },
	{ path: '/api/v1/auth/login', exact: true, method: 'POST' },
	{ path: '/api/v1/user-test', exact: true, method: 'GET' },
	{ path: '/api/v1/auth/login-admin', exact: true, method: 'POST' },
	{ path: '/api/v1/user/create-admin', exact: true, method: 'POST' },
	{ path: '/api/v1/user/forgot-password', exact: true, method: 'POST' },
	{ path: '/api/v1/user/reset-password', exact: false, method: 'PATCH' },
	//product
	{ path: '/api/v1/product', exact: true, method: 'GET' },
	{ path: '/api/v1/product-user/', exact: false, method: 'GET' },
	{ path: '/api/v1/product-available', exact: true, method: 'GET' },
	//payment
	{ path: '/api/v1/payment', exact: true, method: 'POST' },
	//image
	// { path: '/api/v1/images', exact: false, method: 'GET' },
	// '/api/v1/image',
	//admin
	//test
	{ path: '/api/v1/networks', exact: true, method: 'GET' },
	{ path: '/api/v1/serviceType', exact: true, method: 'GET' },
	//order
	// { path: '/api/v1/order/filter', exact: true, method: 'GET' },//access
	// { path: '/api/v1/user/mail', exact: true, method: 'GET' },
	//admin
	//webhook
	{ path: '/api/v1/webhook/imei', exact: true, method: 'GET' },
	// { path: '/api/v1/webhook/order', exact: true, method: 'POST' },
	// { path: '/api/v1/tuan', method: 'GET', exact: true },
	// { path: '/api/v1/history', method: 'GET', exact: true },
	//shop
	{ path: '/api/v1/shop/user', exact: true, method: 'GET' },
	{ path: '/api/v1/shop/backup', exact: false, method: 'GET' },

	// { path: '/api/v1/shop/gmail', exact: true, method: 'GET' },
];
const requireAdminRoleList = [
	//product
	{ path: '/api/v1/product', method: 'POST', exact: true },
	{ path: '/api/v1/product', method: 'DELETE', exact: false },
	{ path: '/api/v1/product-admin', method: 'GET', exact: false },
	{ path: '/api/v1/network', exact: true, method: 'POST' },
	{ path: '/api/v1/network/', exact: false, method: 'PATCH' },
	{ path: '/api/v1/network/', exact: false, method: 'DELETE' },
	{ path: '/api/v1/all-product', exact: true, method: 'GET' }, //admin
	//payment
	{ path: '/api/v1/payment/all', method: 'GET', exact: true },
	//order
	{ path: '/api/v1/order/success', method: 'PATCH', exact: false },
	{ path: '/api/v1/order/', method: 'PUT', exact: false },
	{ path: '/api/v1/ordersPerPage', exact: true, method: 'GET' },
	// { path: '/api/v1/order/income', exact: true, method: 'GET' },
	// { path: '/api/v1/order/count-admin', exact: true, method: 'GET' },
	{ path: '/api/v1/order/', exact: false, method: 'DELETE' },
	//user
	{ path: '/api/v1/user/count', exact: true, method: 'GET' },
	{ path: '/api/v1/user/delete/', exact: false, method: 'DELETE' },
	{ path: '/api/v1/user/admin-password', exact: true, method: 'PATCH' },
	//shopInfo
	{ path: '/api/v1/shop/admin', exact: true, method: 'GET' },
	{ path: '/api/v1/shop/gmail-url', exact: true, method: 'GET' },
	{ path: '/api/v1/shop/backup-token', exact: true, method: 'GET' },
	{ path: '/api/v1/shop/bank', exact: true, method: 'PATCH' }, //admin
	{ path: '/api/v1/shop/confirm-qr', exact: true, method: 'PATCH' }, //admin
	{ path: '/api/v1/shop', exact: true, method: 'PUT' }, //admin
	//analysis
	{ path: '/api/v1/analyst/admin/all', exact: true, method: 'GET' },
	//cash-out
	{ path: '/api/v1/cash-out/admin/', exact: true, method: 'GET' },
	{ path: '/api/v1/cash-out/complete/', exact: false, method: 'POST' },
];

function getTokenFromHeader(authHeader) {
	if (
		authHeader &&
		authHeader.split(' ')[0] === AppConsts.HEADER_AUTHORIZATION_PREFIX
	) {
		return authHeader.split(' ')[1];
	}
	return null;
}
const validateUserPermission = new UserService().validateUserPermission;

module.exports = {
	/**
	 *
	 * @param {Request} req  Request
	 * @param {Response} res Response
	 * @param {NextFunction} next NextFunction
	 */
	async authMiddleware(req, res, next) {
		const { requestType, roleNeeded } = getTypeRequest({
			path: req.path,
			method: req.method,
			whitelist: whitelist,
			adminList: requireAdminRoleList,
			refreshList: listRefreshToken,
		});
		if (requestType === 'white') return next();

		const [tokenType, clientToken] = (() => {
			if (requestType === 'access') {
				return [
					TOKEN_TYPE.ACCESS_TOKEN,
					getTokenFromHeader(req.header('accessToken')),
				];
			}
			return [
				TOKEN_TYPE.REFRESH_TOKEN,
				getTokenFromHeader(req.header('refreshToken')),
			];
		})();
		// res.json('1');
		// return;
		if (!clientToken) throw new BadRequest('No token provided');
		const verifyToken = await validateUserPermission(
			tokenType,
			clientToken
		);
		if (!verifyToken.access) {
			if (verifyToken.message === 'Token is Exprired!') {
				throw new ServerError('Token is Exprired!');
		}
			throw new BadRequest(verifyToken.message);
		}
		if (!roleNeeded.includes(verifyToken.role)) {
			throw new BadRequest('role invalid');
		}

		req.body.user = verifyToken.id;
		req.body.email = verifyToken.email;
		req.body.userRole = verifyToken.role;
		req.body.token = clientToken;

		return next();

		// next();
	},
};
