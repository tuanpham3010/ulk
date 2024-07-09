const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const { loggerMiddleware } = require('../middlewares/logger.middleware');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { handleErrors } = require('../middlewares/errors.middleware');
const { Forbidden } = require('../libs/errors');
const helmet = require('helmet');
const { asyncHandle } = require('@/utils/auth.utils');
console.log(process.env);
const { ALLOW_DOMAINS, COOKIE_SECRET } = process.env;
/**
 * @param {express.Express} app
 */
function middlewareConfig(app) {
	app.use(helmet());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(cookieParser(COOKIE_SECRET));

	const whitelist = ALLOW_DOMAINS.split(',') ?? [];
	app.use(
		cors({
			origin: function (origin, callback) {
				if (
					whitelist.indexOf(origin) !== -1 ||
					whitelist.indexOf('*') !== -1
				) {
					callback(null, true);
				} else {
					const corsError = new Forbidden('Domain not allowed!');
					callback(corsError);
				}
			},
			credentials: true,
			maxAge: 300,
		})
	);

	// Logger
	app.use(loggerMiddleware);
	// auth
	app.use(asyncHandle(authMiddleware));
	// app.use(handleErrors);
	// Error handle
	setImmediate(() => {
		app.use(handleErrors);
	});
}

module.exports = middlewareConfig;
