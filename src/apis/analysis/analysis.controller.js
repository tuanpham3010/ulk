const AnalystService = require('./analysis.service');

class AnalystController {
	constructor() {
		this.AnalystService = new AnalystService();
		this.getAnalystData = this.getAnalystData.bind(this);
		this.getCountOrderByUser = this.getCountOrderByUser.bind(this);
		this.getMoneyUsedByUser = this.getMoneyUsedByUser.bind(this);
	}

	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async getAnalystData(req, res) {
		const timeToGet = req.query.time;
		const analyst = await this.AnalystService.getAnalystData(timeToGet);
		res.json({
			success: true,
			data: analyst,
		});
	}
	async getCountOrderByUser(req, res) {
		const query = { user: req.body.user, ...req.query };
		res.status(200).json(await this.AnalystService.countOrder(query));
	}
	async getMoneyUsedByUser(req, res) {
		res.status(200).json(
			await this.AnalystService.getMoneyUserUsed(req.body.user)
		);
	}
}
module.exports = new AnalystController();
