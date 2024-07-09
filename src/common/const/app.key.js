class AppKeys {
	static ENV_MODE = Object.freeze({
		DEV: 'dev',
		PROD: 'prod',
		STAGING: 'staging',
	});

	static SCHEMA_OPTIONS = Object.freeze({
		toJSON: {
			virtuals: true,
			aliases: true,
		},
		toObject: {
			virtuals: true,
			aliases: true,
		},
		timestamps: true,
		versionKey: false,
	});

	static ROLE_ENUM = Object.freeze({
		// moderator: 'moderator',
		admin: 'admin',
		user: 'user',
	});
	static STATE_ENUM = ['success', 'pending', 'fail', 'cancel'];
	static TOKEN_TYPE = Object.freeze({
		REFRESH_TOKEN: 'refreshToken',
		ACCESS_TOKEN: 'accessToken',
		RESET_PASSWORD_TOKEN: 'resetPasswordToken',
	});
}

module.exports = AppKeys;
