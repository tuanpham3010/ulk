const jwt = require('jsonwebtoken');
const {
	REFRESH_TOKEN_SECRET,
	ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_EXPIRE_TIME,
	ACCESS_TOKEN_EXPIRE_TIME,
	RESET_PASSWORD_EXPIRE_TIME,
	RESET_PASSWORD_SECRET,
} = process.env;
const { AppKeys } = require('@/common/const');
const { ServerError } = require('../errors');

class JwtLib {
	static signToken(tokenType, payload) {
		let token = null;

		switch (tokenType) {
			case AppKeys.TOKEN_TYPE.ACCESS_TOKEN:
				token = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
					expiresIn: parseInt(ACCESS_TOKEN_EXPIRE_TIME),
				});
				break;
			case AppKeys.TOKEN_TYPE.REFRESH_TOKEN:
				token = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
					expiresIn: parseInt(REFRESH_TOKEN_EXPIRE_TIME),
				});
				break;
			case AppKeys.TOKEN_TYPE.RESET_PASSWORD_TOKEN:
				token = jwt.sign(payload, RESET_PASSWORD_SECRET, {
					expiresIn: parseInt(RESET_PASSWORD_EXPIRE_TIME),
				});
				break;
			default:
				throw new ServerError('Token type invalid!');
		}
		return token;
	}

	static verifyToken(tokenType, token) {
		let payload = null;
		try {
			switch (tokenType) {
				case AppKeys.TOKEN_TYPE.ACCESS_TOKEN:
					payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
					break;
				case AppKeys.TOKEN_TYPE.REFRESH_TOKEN:
					payload = jwt.verify(token, REFRESH_TOKEN_SECRET);
					break;
				case AppKeys.TOKEN_TYPE.RESET_PASSWORD_TOKEN:
					payload = jwt.verify(token, RESET_PASSWORD_SECRET);
					break;
				default:
					throw new ServerError('Token type invalid!');
			}
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError) {
				throw new ServerError('Token is Exprired!');
			}

			if (error instanceof jwt.JsonWebTokenError) {
				throw new ServerError(error.message);
			}

			throw new ServerError('Unknow error!');
		}
		return payload;
	}

	static getToken(req) {
		const splitToken = req.get('authorization')?.split(' ');
		if (!splitToken) {
			return null;
		}
		return {
			scheme: splitToken[0],
			token: splitToken[1],
		};
	}

	static decodeToken(token, options) {
		const decoded = jwt.decode(token, options);
		return decoded;
	}
}

module.exports = JwtLib;
