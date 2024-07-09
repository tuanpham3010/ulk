const JwtLib = require('@/libs/auth/jwt');
const { RedisLib } = require('@/libs/database');
const { AppKeys } = require('@/common/const');
const { ServerError } = require('@/libs/errors');
const User = require('./user.model');
const { pagination } = require('@/utils/pagination.utils');

class UserRepository {
	async getUserByAnyField({ query }) {
		return User.findOne(query).lean();
	}

	static async findAUserById(userId) {
		return User.findById(userId).lean();
	}
	async findAUserById(userId) {
		return User.findById(userId).lean();
	}
	async findUsers({
		query = {},
		sort = { createdAt: -1 },
		page = '',
		limit = '',
		select = '',
		populate = [],
	}) {
		return await pagination({
			Model: User,
			query,
			sort,
			page,
			limit,
			populate,
			select,
		});
	}
	async getRefreshTokenAvalid(userId) {
		let refreshToken = await RedisLib.getUserSection(userId);
		try {
			if (refreshToken) {
				JwtLib.verifyToken(
					AppKeys.TOKEN_TYPE.REFRESH_TOKEN,
					refreshToken
				);
			}
		} catch (error) {
			if (
				error.status === 500 &&
				error.message === 'Token is Exprired!'
			) {
				await RedisLib.removeUserSection(userId, refreshToken);
				refreshToken = await this.getRefreshTokenAvalid(userId);
			} else {
				throw new ServerError('Unknow error!');
			}
		}
		return refreshToken;
	}

	async generateNewRefreshToken(userId, userPayload) {
		const refreshToken = JwtLib.signToken(
			AppKeys.TOKEN_TYPE.REFRESH_TOKEN,
			userPayload
		);
		await RedisLib.setUserSection(
			userId,
			refreshToken,
			parseInt(process.env.REFRESH_TOKEN_EXPIRE_TIME)
		);
		return refreshToken;
	}
	async generateNewAccessToken(userId, userPayload) {
		const accessToken = JwtLib.signToken(
			AppKeys.TOKEN_TYPE.ACCESS_TOKEN,
			userPayload
		);
		await RedisLib.setUserAccess(
			userId,
			accessToken,
			parseInt(process.env.ACCESS_TOKEN_EXPIRE_TIME)
		);
		return accessToken;
	}
	async generateResetPasswordToken(userId, userPayload) {
		const token = JwtLib.signToken(
			AppKeys.TOKEN_TYPE.RESET_PASSWORD_TOKEN,
			userPayload
		);
		await RedisLib.setUserResetPassword(
			userId,
			token,
			parseInt(process.env.RESET_PASSWORD_EXPIRE_TIME)
		);
		return token;
	}
}

module.exports = UserRepository;
