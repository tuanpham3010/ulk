const Logger = require('../libs/common/logger.service');

// eslint-disable-next-line no-unused-vars
const { Request, Response, NextFunction } = require('express');

module.exports = {
	/**
	 *
	 * @param {Request} req  Request
	 * @param {Response} res Response
	 * @param {NextFunction} next NextFunction
	 */
	loggerMiddleware: async (req, res, next) => {
		const logData = {};
		if (req.body && Object.values(req.body).length > 0) {
			logData['body'] = req.body;
		}

		if (req.params && Object.values(req.params).length > 0) {
			logData['params'] = req.params;
		}

		if (req.query && Object.values(req.query).length > 0) {
			logData['query'] = req.query;
		}

		const path = req.path;

		Logger.writeLog('info', logData, req.method, path);

		const oldJson = res.json;
		res.json = function (data) {
			Logger.writeLog('info', data, req.method, path, res.statusCode);
			return oldJson.apply(res, arguments);
		};
		next();
	},
};
