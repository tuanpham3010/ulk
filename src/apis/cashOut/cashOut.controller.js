const CashOutService = require('./cashOut.service');

class CashOutController {
	constructor() {
		this.cashOutService = new CashOutService();
	}
	createRequest = async (req, res) => {
		res.status(201).json(
			await this.cashOutService.createRequestCashOut(req.body)
		);
	};
	completeRequest = async (req, res) => {
		res.status(200).json(
			await this.cashOutService.completeRequest({
				requestId: req.params.requestId,
				state: req.body.state,
				messageForUser: req.body.messageForUser,
			})
		);
	};
	getUserRequests = async (req, res) => {
		res.status(200).json(
			await this.cashOutService.findRequests({
				...req.query,
				user: req.body.user,
			})
		);
	};
	getRequests = async (req, res) => {
		res.status(200).json(await this.cashOutService.findRequests(req.query));
	};
	getARequest = async (req, res) => {
		res.status(200).json(
			await this.cashOutService.findRequests({
				...req.body,
				requestId: req.params.requestId,
			})
		);
	};

	deleteRequest = async (req, res) => {
		res.status(200).json(
			await this.cashOutService.deleteRequest(req.params.requestId)
		);
	};
	updateRequest = async (req, res) => {
		res.status(200).json(
			await this.cashOutService.updateRequest(
				req.params.requestId,
				req.body
			)
		);
	};
	cancelRequestByUser = async (req, res) => {
		const query = { requestId: req.params.requestId, user: req.body.user };
		res.status(200).json(
			await this.cashOutService.updateRequest(query, { state: 'cancel' })
		);
	};
}

module.exports = new CashOutController();
