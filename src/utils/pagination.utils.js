const { BadRequest } = require('@/libs/errors');

class paginationUtils {
	static async pagination({
		Model,
		query = {},
		sort = { updateAt: -1 },
		page = '',
		limit = '',
		populate = '',
		select = '',
	}) {
		const skip = page ? (page - 1) * limit : '';
		// if (!skip) throw new BadRequest('page invalid');
		if (skip < 0) throw new BadRequest('page invalid');
		const getRecordPromise = async () => {
			return await Model.find(query)
				.populate(populate)
				.sort(sort)
				.skip(skip)
				.limit(limit)
				.select(select)
				.lean();
		};
		const getPageInfoPromise = async () => {
			if (!limit) return {};
			if (!page) return {};
			const totalRecords = await Model.countDocuments(query);
			const maxPage = Math.ceil(totalRecords / limit);
			return {
				maxPage,
				current: Number(page),
				pageSize: Number(limit),
				next: Number(page) < maxPage,
				prev: Number(page) > 1 && Number(page) <= maxPage,
				total: totalRecords,
			};
		};
		const [data, pageInfo] = await Promise.all([
			getRecordPromise(),
			getPageInfoPromise(),
		]);
		return { data, pageInfo };
	}
}

module.exports = paginationUtils;
