const { HttpException, ServerError } = require('../libs/errors');
const Logger = require('@/libs/common/logger.service');

module.exports = {
	/**
	 *
	 * @param {Error} err
	 * @param {import("express").Response} res
	 */
	// eslint-disable-next-line no-unused-vars
	handleErrors: async (err, req, res, next) => {
		//need 4 arguments
		try {
			if (err instanceof HttpException) {
				Logger.writeLog(
					'error',
					{
						message: err.message,
						user: req.body.user,
						type: 'http error',
					},
					req.method,
					req.path,
					500
				);
				res.status(err.status).json({
					status: err.status,
					message: err.message,
					code: err.errorCode,
				});
				return;
			}
			Logger.writeLog(
				'error',
				{
					message: err.message,
					user: req.body.user,
					type: 'internal error',
				},
				req.method,
				req.path,
				500
			);
			const serverError = new ServerError();
			res.status(serverError.status).json({
				status: serverError.status,
				message: serverError.message,
			});
		} catch (error) {
			Logger.writeLog('error', { message: error.message });
		}
	},
};
