class RedisKey {
	static generateSectionKey(userId) {
		return `user_section::${userId}`;
	}
	static generateAccessKey(userId) {
		return `user_access::${userId}`;
	}
	static generateResetPasswordKey(userId) {
		return `user_reset_password::${userId}`;
	}
	static generateBackupKey() {
		return `backup`;
	}
	static generateSetOrderPendingKey() {
		return `order_pending`;
	}
}

module.exports = RedisKey;
