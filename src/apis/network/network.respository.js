const { pagination } = require('@/utils/pagination.utils');
const Network = require('./network.model');

class NetworkRepository {
	async findNetworks({
		query = {},
		sort = { createdAt: -1 },
		page = '',
		limit = '',
		select = '',
		populate = [],
	}) {
		return await pagination({
			Model: Network,
			query,
			sort,
			page,
			limit,
			populate,
			select,
		});
	}
}
module.exports = NetworkRepository;
