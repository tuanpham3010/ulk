const Logger = require('@/libs/common/logger.service');
const UserRecharge = require('./payment.model');
const { pagination } = require('@/utils/pagination.utils');

class PaymentRepository {
	async findPayments({
		query = {},
		sort = { createdAt: -1 },
		page = '',
		limit = '',
		populate = '',
		select = '-info',
	}) {
		return await pagination({
			Model: UserRecharge,
			query,
			sort,
			page,
			limit,
			populate,
			select,
		});
	}

	async createNewPayment({ paymentId, userId, info, amount, paymentType }) {
		try {
			return await UserRecharge.create({
				paymentId,
				userId,
				info,
				amount,
				paymentType,
			});
		} catch (error) {
			Logger.writeLog('error', {
				message: 'create New Payment error',
				error,
			});
		}
		return null;
	}
	async updatePayment(query, payload) {
		try {
			const paymentUpdated = await UserRecharge.findOneAndUpdate(
				query,
				payload,
				{ new: true, runValidators: true }
			).lean();

			return {
				success: true,
				paymentUpdated,
			};
		} catch (error) {
			Logger.writeLog('error', {
				message: 'createNewPaymet error',
				error,
			});
		}
		return {};
	}
}
module.exports = PaymentRepository;
