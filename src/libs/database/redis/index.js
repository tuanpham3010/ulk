const RedisKey = require('./redisKey');
const { redisClient } = require('@/configs/database/redis.config');

class RedisLib {
	/**
	 *
	 * @param {string} userId - userId of section
	 * @param {*} refreshToken - refresh token of user
	 * @param {*} tokenExpireTime - expire time of section in seconds
	 */

	//section
	static async setUserSection(userId, refreshToken, tokenExpireTime) {
		const userSection = await redisClient.get(
			RedisKey.generateSectionKey(userId)
		);
		if (!userSection) {
			const res = await redisClient.set(
				RedisKey.generateSectionKey(userId),
				refreshToken,
				'EX',
				tokenExpireTime,
				'NX'
			);
			return res;
		}
		const res = await redisClient.set(
			RedisKey.generateSectionKey(userId),
			refreshToken,
			'EX',
			tokenExpireTime,
			'XX'
		);
		return res;
	}
	static async removeUserSection(userId, refreshToken) {
		const res = await redisClient.del(
			RedisKey.generateSectionKey(userId),
			refreshToken
		);
		return res;
	}
	static async getUserSection(userId) {
		const userSection = await redisClient.get(
			RedisKey.generateSectionKey(userId)
		);
		return userSection;
	}
	//access
	static async setUserAccess(userId, accessToken, tokenExpireTime) {
		const userAccess = await redisClient.get(
			RedisKey.generateAccessKey(userId)
		);
		if (!userAccess) {
			const res = await redisClient.set(
				RedisKey.generateAccessKey(userId),
				accessToken,
				'EX',
				tokenExpireTime,
				'NX'
			);
			return res;
		}
		const res = await redisClient.set(
			RedisKey.generateAccessKey(userId),
			accessToken,
			'EX',
			tokenExpireTime,
			'XX'
		);
		return res;
	}

	static async removeUserAccess(userId, accessToken) {
		const res = await redisClient.del(
			RedisKey.generateAccessKey(userId),
			accessToken
		);
		return res;
	}
	static async getUserAccess(userId) {
		const userAccess = await redisClient.get(
			RedisKey.generateAccessKey(userId)
		);
		return userAccess;
	}
	//resetPasswordToken
	static async setUserResetPassword(userId, token, tokenExpireTime = 1800) {
		const userAccess = await redisClient.get(
			RedisKey.generateResetPasswordKey(userId)
		);
		if (!userAccess) {
			const res = await redisClient.set(
				RedisKey.generateResetPasswordKey(userId),
				token,
				'EX',
				tokenExpireTime,
				'NX'
			);
			return res;
		}
		const res = await redisClient.set(
			RedisKey.generateResetPasswordKey(userId),
			token,
			'EX',
			tokenExpireTime,
			'XX'
		);
		return res;
	}

	static async removeUserResetPassword(userId, token) {
		const res = await redisClient.del(
			RedisKey.generateResetPasswordKey(userId),
			token
		);
		return res;
	}
	static async getUserResetPassword(userId) {
		const token = await redisClient.get(
			RedisKey.generateResetPasswordKey(userId)
		);
		return token;
	}

	static async setBackup({ value, expire }) {
		const userAccess = await redisClient.get(RedisKey.generateBackupKey());
		if (!userAccess) {
			const res = await redisClient.set(
				RedisKey.generateBackupKey(),
				value,
				'EX',
				expire,
				'NX'
			);
			return res;
		}
		const res = await redisClient.set(
			RedisKey.generateBackupKey(),
			value,
			'EX',
			expire,
			'XX'
		);
		return res;
	}
	static async getBackup() {
		const token = await redisClient.get(RedisKey.generateBackupKey());
		return token;
	}
	static async removeBackUp() {
		const res = await redisClient.del(RedisKey.generateBackupKey());
		return res;
	}
	static async addToOrderPendingToSet(orderId) {
		const res = await redisClient.sadd(
			RedisKey.generateSetOrderPendingKey(),
			orderId
		);
		return res;
	}
	static async getToOrderPendingToSet() {
		const res = await redisClient.smembers(
			RedisKey.generateSetOrderPendingKey()
		);
		return res;
	}
	static async removeToOrderPendingToSet(orderId) {
		const res = await redisClient.srem(
			RedisKey.generateSetOrderPendingKey(),
			orderId
		);
		return res;
	}
}

module.exports = RedisLib;
