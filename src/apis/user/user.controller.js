const fs = require('fs');
const { ADMIN_ROLE, USER_ROLE } = require('@/common/const/app.const');
const UserService = require('./user.service');
const { sendMailForShopAndUser, sendMail } = require('@/libs/mail/mail');
class UserController {
	constructor() {
		this.userService = new UserService();
		this.getDongtest = this.getDongtest.bind(this);
		this.getUserById = this.getUserById.bind(this);
		this.getAllUser = this.getAllUser.bind(this);
		this.updateUser = this.updateUser.bind(this);
		this.deleteUser = this.deleteUser.bind(this);
		this.createUser = this.createUser.bind(this);
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.getCurrentUser = this.getCurrentUser.bind(this);
		this.token = this.token.bind(this);
		this.createAdmin = this.createAdmin.bind(this);
		this.loginAdmin = this.loginAdmin.bind(this);
		this.forgotPassword = this.forgotPassword.bind(this);
		this.resetPassword = this.resetPassword.bind(this);
		this.changePasswordByUser = this.changePasswordByUser.bind(this);
		this.changePasswordByAdmin = this.changePasswordByAdmin.bind(this);
	}

	async getDongtest(req, res) {
		const data = await this.userService.getDongtest();
		res.json(data);
	}
	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async getUserById(req, res) {
		const userId = req.params.id;
		const user = await this.userService.getUserById(userId);
		res.json(user);
	}
	async changePasswordByUser(req, res) {
		res.status(200).json(
			await this.userService.changePasswordByUser({
				...req.body,
				userRole: USER_ROLE,
			})
		);
	}
	async changePasswordByAdmin(req, res) {
		res.status(200).json(
			await this.userService.changePasswordByUser({
				...req.body,
				userRole: ADMIN_ROLE,
			})
		);
	}
	async getAllUser(req, res) {
		const allUser = await this.userService.getAllUser(req.query);
		res.json(allUser);
	}
	async updateUser(req, res) {
		const { userId, data } = req.body;
		const updateUser = await this.userService.updateUser(userId, data);
		res.json(updateUser);
	}

	async deleteUser(req, res) {
		const userId = req.params.id || '1';
		const deleteUser = await this.userService.deleteUser(userId);
		res.json(deleteUser);
	}
	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */

	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async createUser(req, res) {
		const user = req.body;
		const userCreated = await this.userService.createUser(user);
		res.json(userCreated);
		const shopOption = {
			subject: 'Thông báo từ Airpot',
			text: `Người dùng ${user.first_name + ' ' + user.last_name} email:${user.email
				} vừa đăng kí trên trang web`,
		};
		const userOption = {
			to: req.body.email,
			subject: 'Thông báo từ Airpot',
			text: `Chào mừng bạn đến với Airpot`,
		};
		await sendMailForShopAndUser(shopOption, userOption);
	}

	async createAdmin(req, res) {
		const user = req.body;
		const userCreated = await this.userService.createAdmin(user);
		res.json(userCreated);
	}

	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async login(req, res) {
		const userAccount = req.body;
		const loginResponseData = await this.userService.loginUser(userAccount);
		res.json(loginResponseData);
	}
	async logout(req, res) {
		const userAccount = req.body;
		const logoutResponseData = await this.userService.logout(userAccount);
		res.json(logoutResponseData);
	}
	async getCurrentUser(req, res) {
		const email = req.body?.email;
		const reLoginResponseData = await this.userService.getCurrentUser(
			email
		);
		res.json(reLoginResponseData);
	}
	async token(req, res) {
		const email = req.body?.email;
		const refreshToken = req.body?.token;
		const accessTokenResponseData = await this.userService.getAccessToken(
			email,
			refreshToken
		);
		res.json(accessTokenResponseData);
	}
	testMail = async (req, res) => {
		try {
			const fileContent = fs.readFileSync(
				'src\\libs\\mail\\emailTemplate\\orderconfirm.html'
			);
			const data = {
				user_name: 'John Doe',
				service_name: '123',
				service_type: 'block chain',
				service_brand: 'Viettel',
				service_desc: 'ko co j dac biet',
				Order_createdAt: '11/11/11',
				total_payment: 30000,
			};
			const html = fileContent
				.toString()
				.replace(/\[(.+?)\]/g, (match, p1) => {
					return data[p1];
				});

			const mailOptions = {
				from: process.env.MAIL,
				to: 'vandathd49@gmail.com',
				subject: 'Hello from Nodemailer',
				html,
			};
			await sendMail(mailOptions);
			res.send('ok');
		} catch (error) {
			res.send(error.message);
		}
	};
	async forgotPassword(req, res) {
		const userReset = req.body;
		res.status(200).json(
			await this.userService.handleForgotPassword(userReset)
		);
	}
	async resetPassword(req, res) {
		const token = req.params.token;
		res.status(200).json(
			await this.userService.handleResetPassword(token, req.body)
		);
	}
	async loginAdmin(req, res) {
		const adminAccount = req.body;
		const loginResponseData = await this.userService.loginAdmin(
			adminAccount,
			ADMIN_ROLE
		);
		res.json(loginResponseData);
	}
}

module.exports = new UserController();
