const UserRepository = require('./user.repository');
const UserValidate = require('./user.validate');
const User = require('./user.model');
const JwtLib = require('@/libs/auth/jwt');
const { RedisLib } = require('@/libs/database');
const Bcrypt = require('@/libs/hash/bcrypt');
const { AppKeys } = require('@/common/const');
const { BadRequest } = require('@/libs/errors');
const { USER_ROLE, ADMIN_ROLE } = require('@/common/const/app.const');
const Logger = require('@/libs/common/logger.service');
const { sendMailForShop } = require('@/libs/mail/mail');
const { TOKEN_TYPE } = require('@/common/const/app.key');
const QrUtils = require('@/utils/qr.utils');
const { generateRechargeMessage } = require('@/utils/common.utils');
const { errorCodes, listMessage } = require('@/common/const/app.errorCode');
const { getShopInfo } = require('@/libs/common/shopInfo');
const { sendResetPasswordEmail } = require('./user.email');

// const { FE_URI } = process.env;
class UserService {
	constructor() {
		this.userRepository = new UserRepository();
	}

	async getDongtest() {
		// const ACCESS_TOKEN = 'M17-AC8-6BL-XI6-RYC-HWC-I8Y-DSJ';
		// const SERVICE_ID = 23;
		// const IMEI = 352396474678311;
		// const req = await fetch(
		// 	`https://api.imei.com.vn/instant?token=${ACCESS_TOKEN}&service_id=${SERVICE_ID}&imei=${IMEI}`,
		// 	{
		// 		method: 'GET',
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 		},
		// 	}
		// );
		// const res = await req.json();

		await RedisLib.addToOrderPendingToSet([1]);
		await RedisLib.removeToOrderPendingToSet(1);
		const res = await RedisLib.getToOrderPendingToSet();
		return {
			success: true,
			res,
		};
	}
	async getUserById(userId) {
		if (userId) {
			try {
				const realUser = await User.findById(userId).lean();
				if (!realUser) throw new BadRequest('Error went get user!');
				const user = { id: realUser._id, ...realUser };
				return {
					success: true,
					data: user,
				};
			} catch (error) {
				throw new BadRequest('Error went get user!');
			}
		}
		throw new BadRequest('Error went get user!');
	}

	async getAllUser({ pageSize, currentPage, email }) {
		let query = {};
		let limit = pageSize || 20;
		let page = currentPage || 1;
		if (email) {
			query.email = {
				$regex: email,
				$options: 'i',
			};
		}
		const { data, pageInfo } = await this.userRepository.findUsers({
			query,
			page,
			limit,
		});
		return {
			success: true,
			data,
			pageInfo,
		};
	}
	async changePasswordByUser({ oldPassword, user, newPassword, userRole }) {
		const realUser = await User.findOne({ _id: user, role: userRole })
			.select('+password')
			.lean();
		const { error } = UserValidate.passwordSchema.validate(newPassword);

		if (error) throw new BadRequest(listMessage.password_invalid);
		if (!realUser)
			throw new BadRequest(
				listMessage.user_not_found,
				errorCodes.user_not_found
			);
		const { password } = realUser;
		const isCorrectPassword = await Bcrypt.compare(password, oldPassword);
		if (!isCorrectPassword) {
			throw new BadRequest(listMessage.password_fail);
		}
		await User.updateOne({ _id: user }, { password: newPassword });

		return {
			success: true,
			message: listMessage.change_password_success,
		};
	}
	async updateUser(userId, data) {
		delete data.password; // prevent changePassword
		const updateUser = await User.findByIdAndUpdate(
			userId,
			{ ...data },
			{ new: true }
		);
		if (!updateUser) throw new BadRequest('Error went update user');
		return {
			success: true,
			data: updateUser,
		};
	}

	async deleteUser(userId) {
		const deleteUser = await User.findByIdAndDelete(userId);
		if (!deleteUser) throw new BadRequest('Error went delete user');
		return {
			success: true,
			data: deleteUser,
		};
	}

	async validateUserPermission(tokenType, clientToken) {
		const verifyToken = JwtLib.verifyToken(tokenType, clientToken);
		try {
			if (verifyToken && verifyToken.email) {
				const realUser = await User.findOne({
					email: verifyToken.email,
					role: verifyToken.role,
				}).select('id');
				if (realUser) {
					if (tokenType === AppKeys.TOKEN_TYPE.ACCESS_TOKEN) {
						const accessToken = await RedisLib.getUserAccess(
							realUser.id
						);
						if (!accessToken)
							return {
								access: false,
								message: 'Token is Exprired!',
							};
						if (accessToken === clientToken) {
							return {
								access: true,
								id: realUser.id,
								email: verifyToken.email,
								role: verifyToken.role,
							};
						} else {
							return {
								access: false,
								message: 'Token is Exprired!',
							};
						}
					}
					if (tokenType === AppKeys.TOKEN_TYPE.REFRESH_TOKEN) {
						const refreshToken = await RedisLib.getUserSection(
							realUser.id
						);
						if (refreshToken === clientToken) {
							return {
								access: true,
								id: realUser.id,
								email: verifyToken.email,
								role: verifyToken.role,
							};
						} else {
							return {
								access: false,
								message: 'Token is Exprired!',
							};
						}
					}
				}
			}
			return {
				access: false,
				message: 'Access denied',
			};
		} catch (error) {
			return {
				access: false,
				message: error,
			};
		}
	}
	async testMail() {
		const mailOptions = {
			from: 'tuan3010',
			subject: 'Hello from Nodemailer',
			text: 'test',
		};
		await sendMailForShop(mailOptions);
	}
	async createUser(user, roleCreate = USER_ROLE) {
		let validationUser = UserValidate.createUserSchema.validate(user);
		if (validationUser.error) {
			throw new BadRequest(listMessage.register_error);
		}
		// if (roleCreate === ADMIN_ROLE && user.code !== 'dong_chomottinhyeu') {
		// 	throw new BadRequest('Access denied');
		// }
		const isUserExist = await User.findOne({
			$or: [{ email: user.email }, { phone: user.phone }],
		})
			.select('id email phone')
			.lean();
		if (isUserExist) {
			const errorType =
				isUserExist.email === user.email
					? 'email_exist'
					: 'phone_exist';
			throw new BadRequest(listMessage[errorType], errorCodes[errorType]);
		}
		const newUser = new User({
			email: user.email,
			phone: user.phone,
			password: user.password,
			first_name: user.first_name,
			last_name: user.last_name,
			role: roleCreate,
			balance: 0,
		});
		const createdUser = await newUser.save();
		if (!createdUser) {
			throw new BadRequest(
				listMessage.register_error,
				errorCodes.register_error
			);
		}
		const createUserResponseData = {
			success: true,
			user: {
				email: createdUser.email,
				fullname: createdUser.fullname,
				role: createdUser.role,
			},
		};

		return createUserResponseData;
	}

	async login(userAccount, roleLogin) {
		const realUser = await (async () => {
			const isLoginWithPhone = userAccount.isLoginPhoneNumber;
			delete userAccount.isLoginPhoneNumber;
			const [query, validateError] = (() => {
				if (isLoginWithPhone) {
					delete userAccount.email;
					return [
						{ phone: userAccount.phone, role: roleLogin },
						UserValidate.loginPhoneUserSchema.validate(userAccount)
							.error,
					];
				}
				delete userAccount.phone;
				return [
					{ email: userAccount.email, role: roleLogin },
					UserValidate.loginUserSchema.validate(userAccount).error,
				];
			})();
			if (validateError) {
				const errorType = 'account_password_incorrect';
				throw new BadRequest(
					listMessage[errorType],
					errorCodes[errorType]
				);
			}
			return User.findOne(query).select('+password').lean();
		})();

		Logger.writeLog('info', {
			userAccount,
			message: 'user login',
		});
		if (!realUser) {
			const errorType =
				roleLogin === ADMIN_ROLE
					? 'user_not_found'
					: 'account_password_incorrect';
			throw new BadRequest(listMessage[errorType], errorCodes[errorType]);
		}
		const {
			password: realPasswordEncoded,
			_id: userId,
			email,
			phone,
			role,
			first_name,
			last_name,
			balance,
		} = realUser;
		const password = userAccount.password;
		const isCorrectPassword = await Bcrypt.compare(
			realPasswordEncoded,
			password
		);
		if (!isCorrectPassword) {
			throw new BadRequest(
				listMessage.account_password_incorrect,
				errorCodes.account_password_incorrect
			);
		}

		const userPayload = { email, role };

		const refreshToken = await this.userRepository.generateNewRefreshToken(
			userId,
			userPayload
		);
		const accessToken = await this.userRepository.generateNewAccessToken(
			userId,
			userPayload
		);
		const qrCode = await this.getAndUpdateQrCodeUser(realUser);

		const userInfo = {
			email,
			role: role,
			phone,
			firstName: first_name,
			lastName: last_name,
			userId,
			qrCode,
			balance,
		};

		const loginResponseData = {
			success: true,
			data: userInfo,
			accessToken,
			refreshToken,
		};

		return loginResponseData;
	}

	async updateUserQrCode(user) {
		const { bankBin, bankAccount } = getShopInfo();
		if (!(user || bankBin || bankAccount))
			throw new BadRequest('data invalid');
		const qrData = {
			bankAccount,
			bankBin,
		};
		const message = generateRechargeMessage(user.phone);
		const qrCode = QrUtils.generateQr({ ...qrData, message });
		const userRes = await User.findByIdAndUpdate(
			user._id,
			{ qrCode },
			{ new: true }
		);
		return userRes;
	}

	async getAndUpdateQrCodeUser(user) {
		if (user?.role === ADMIN_ROLE) return '';
		if (user?.qrCode) {
			return user?.qrCode;
		}
		const { qrCode } = await this.updateUserQrCode(user);
		return qrCode;
	}

	async loginUser(userAccount) {
		return await this.login(userAccount, USER_ROLE);
	}
	async loginAdmin(adminAccount) {
		return await this.login(adminAccount, ADMIN_ROLE);
	}
	async logout(userAccount) {
		const { email, refreshToken, accessToken } = userAccount;
		const realUser = await User.findOne({ email }).select('email').lean();
		if (!realUser) {
			throw new BadRequest('Email incorrect!');
		}

		const { _id: userId } = realUser;
		// let authorities = this.userRepository.convertRoleName(roles);

		await RedisLib.removeUserSection(userId, refreshToken);
		await RedisLib.removeUserAccess(userId, accessToken);

		const logoutResponseData = {
			success: true,
			message: 'logout_success',
		};

		return logoutResponseData;
	}
	async getUser(query) {
		return await this.userRepository.getUserByAnyField({
			query: { ...query, role: USER_ROLE },
		});
	}
	async getCurrentUser(email) {
		const realUser = await User.findOne({ email: email }).lean();
		if (!realUser) {
			return {
				success: false,
				message: listMessage.user_not_found,
			};
		}
		const { role, first_name, last_name, _id, phone, balance } = realUser;
		const qrCode = await this.getAndUpdateQrCodeUser(realUser);
		const userInfo = {
			userId: _id,
			email,
			role,
			phone,
			firstName: first_name,
			lastName: last_name,
			balance,
			qrCode,
		};
		const userResponseData = {
			success: true,
			data: userInfo,
		};
		return userResponseData;
	}

	async getAccessToken(email, refreshToken) {
		const realUser = await User.findOne({ email: email })
			.select('role')
			.lean();
		if (!realUser) {
			throw new BadRequest('Access denied. Token invalid.');
		}

		const { _id: userId, role } = realUser;
		// let authorities = this.userRepository.convertRoleName(roles);

		let serverRefreshToken = await RedisLib.getUserSection(userId);

		if (!serverRefreshToken || serverRefreshToken !== refreshToken) {
			throw new BadRequest('Access denied. Token invalid.');
		}
		const userPayload = { email: email, role };
		const accessToken = await this.userRepository.generateNewAccessToken(
			userId,
			userPayload
		);
		const accessTokenResponseData = {
			success: true,
			accessToken,
		};

		return accessTokenResponseData;
	}

	// admin access area

	async createAdmin(user) {
		if (user.code !== 'dong_chomottinhyeu') {
			throw new BadRequest('Access denied');
		}
		return await this.createUser(user, ADMIN_ROLE);
	}
	async handleForgotPassword({ email }) {
		if (!email) throw new BadRequest('Not have data');
		//check user in deb
		// const queryUser = {
		// 	$or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
		// };
		const queryUser = {
			email,
		};
		const realUser = await User.findOne(queryUser);
		if (!realUser)
			throw new BadRequest(
				listMessage.user_not_found,
				errorCodes.user_not_found
			);
		// create token
		const payload = {
			id: realUser._id,
			email: realUser.email,
		};
		const token = await this.userRepository.generateResetPasswordToken(
			realUser._id,
			payload
		);
		//sendMail
		// const mailOptions = createResetPasswordOption(realUser, token);
		// const sendMailRes = await sendMail(mailOptions);
		const sendMailRes = await sendResetPasswordEmail(realUser, token);
		if (!sendMailRes) throw new BadRequest('fail sendMail');
		return {
			success: true,
			message: 'check_mail',
		};
	}
	async handleResetPassword(token, { password }) {
		if (!token) throw new BadRequest('not token provided');

		const payload = JwtLib.verifyToken(
			TOKEN_TYPE.RESET_PASSWORD_TOKEN,
			token
		);
		if (!payload) throw new BadRequest();
		const userId = payload.id;
		let serverResetPasswordToken = await RedisLib.getUserResetPassword(
			userId
		);
		if (!serverResetPasswordToken || serverResetPasswordToken !== token) {
			throw new BadRequest('Token invalid.');
		}

		await User.updateOne(
			{ _id: userId, email: payload.email },
			{ password }
		);
		await RedisLib.removeUserResetPassword(userId, token);
		return {
			success: true,
			message: 'reset_success',
		};
	}
	async updateUserBalance(userId, moneyCount) {
		try {
			const userUpdated = await User.findByIdAndUpdate(
				userId,
				{ $inc: { balance: moneyCount } },
				{ new: true, runValidators: true }
			).lean();

			return {
				success: true,
				userUpdated,
			};
		} catch (error) {
			Logger.writeLog('error', {
				message: 'updateUserBalance error',
				error,
			});
		}
		return {};
	}
}

module.exports = UserService;
