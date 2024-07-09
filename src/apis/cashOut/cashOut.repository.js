const { pagination } = require('@/utils/pagination.utils');
const CashOutRequest = require('./cashOut.model');

class cashOutRepository {
	static async findRequest({
		query = {},
		sort = { createdAt: -1 },
		page = '',
		limit = '',
		select = '',
		populate = [],
	}) {
		return await pagination({
			Model: CashOutRequest,
			query,
			sort,
			page,
			limit,
			populate,
			select,
		});
	}
}

module.exports = cashOutRepository;
