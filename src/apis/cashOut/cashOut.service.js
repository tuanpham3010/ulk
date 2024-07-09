const { BadRequest } = require('@/libs/errors');
const User = require('../user/user.model');
const CashOutRequest = require('./cashOut.model');
const {
	createCashOutSchema,
	completeStateSchema,
} = require('./cashOut.validate');
const { userService } = require('../user/user.controller');
const { generateId, randomString } = require('@/utils/common.utils');
const Logger = require('@/libs/common/logger.service');
const cashOutRepository = require('./cashOut.repository');
const { USER_ROLE } = require('@/common/const/app.const');
const { generateQrWithMoney } = require('@/utils/qr.utils');
const { errorCodes, listMessage } = require('@/common/const/app.errorCode');

class CashOutService {
	async findARequestRecent(userId) {
		const timeAgo = new Date();
		timeAgo.setDate(timeAgo.getDate() - 30);
		return await CashOutRequest.findOne({
			userId,
			createdAt: {
				$gte: timeAgo,
				$lt: new Date(),
			},
			state: { $in: ['success', 'pending'] },
		});
	}
	async createRequestCashOut({
		user,
		amount,
		content,
		bankBin,
		bankAccount,
		bankAccountName,
	}) {
		const { error } = createCashOutSchema.validate({
			user,
			amount,
			content,
			bankBin,
			bankAccount,
			bankAccountName,
		});
		if (error) throw new BadRequest(error.message);
		const currentUser = await User.findById(user);
		if (!currentUser) throw new BadRequest('user not found');
		if (currentUser.balance < amount) {
			throw new BadRequest(
				'you not enough money',
				errorCodes.cash_out_not_enough_money
			);
		}

		const checkRecentRequest = await this.findARequestRecent(user);

		if (checkRecentRequest)
			throw new BadRequest(
				"can'create request cash out",
				errorCodes.cash_out_month
			);
		const requestId = generateId(randomString(6), 6);
		const qrCode = generateQrWithMoney({
			bankBin,
			bankAccount,
			message: `1unlocking${requestId}`,
		});
		const newRequest = await CashOutRequest.create({
			userId: user,
			amount,
			content,
			requestId,
			bankBin,
			bankAccount,
			bankAccountName,
			qrCode,
		});
		if (!newRequest) throw new BadRequest('fail to request cash out');
		return { success: true, data: newRequest };
	}

	async completeRequest({ requestId, state, messageForUser }) {
		const { error } = completeStateSchema.validate(state);
		if (error) throw new BadRequest(error.message);
		const query = {
			requestId,
			state: 'pending',
		};
		const currentRequest = await CashOutRequest.findOne(query)
			.populate({
				path: 'userId',
				select: 'balance',
			})
			.lean();
		if (!currentRequest) throw new BadRequest('request not found');
		const user = currentRequest.userId;
		//when state is success
		if (state === 'success') {
			if (user.balance < currentRequest.amount) {
				throw new BadRequest('User balance not enough');
			}
			const userUpdated = await userService.updateUserBalance(
				user._id,
				-currentRequest.amount
			);

			if (!userUpdated) {
				Logger.error({
					message: 'fail to update user balance',
					...currentRequest,
				});
				throw new BadRequest('fail to update user balance');
			}
		}
		//update request
		const requestUpdated = await CashOutRequest.findOneAndUpdate(
			query,
			{ state, messageForUser, completeTime: Date.now() },
			{ new: true }
		).lean();
		if (!requestUpdated) {
			Logger.error({
				message: 'fail to update request',
				...currentRequest,
			});
			throw new BadRequest('fail to update request');
		}

		return { success: true, data: requestUpdated };
	}
	async updateRequest(query, payload) {
		const requestUpdated = await CashOutRequest.findOneAndUpdate(
			query,
			payload,
			{ new: true }
		).lean();
		if (!requestUpdated) throw new BadRequest('fail to update request');

		return { success: true, data: requestUpdated };
	}
	async deleteRequest(requestId) {
		const request = await CashOutRequest.findOneAndDelete({ requestId });
		if (!request) throw new BadRequest('fail to delete request');
	}
	async findRequests({ status, user, requestId, currentPage, pageSize }) {
		let query = {};
		let limit = pageSize || 20;
		let page = currentPage || 1;
		const populate = [
			{ path: 'userId', select: 'first_name last_name balance email' },
		];

		if (status) {
			query.state = status;
		}
		if (requestId) {
			query.requestId = {
				$regex: requestId,
				$options: 'i',
			};
		}
		if (user) {
			query.userId = user;
		}

		const { data, pageInfo } = await cashOutRepository.findRequest({
			query,
			limit,
			page,
			populate,
		});

		return { success: true, data, pageInfo };
	}

	async findARequest({ requestId, userRole, user }) {
		const query = {
			requestId,
		};

		if (userRole === USER_ROLE) {
			query.userId = user;
		}

		return {
			success: true,
			data: await CashOutRequest.findOne(query),
		};
	}
}

module.exports = CashOutService;
