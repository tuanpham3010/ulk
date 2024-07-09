const { randomString } = require('@/utils/common.utils');
const WebhookService = require('./webhook.service');

class WebhookController {
	constructor() {
		this.webhookService = new WebhookService();
	}

	listenWebhookOrder = async (req, res) => {
		return res.json(await this.webhookService.saveResult(req));
	};
	dongtest = async (req, res) => {
		return res.json(await this.webhookService.dongtest(req.body));
	};
	getGmailTest = async (req, res) => {
		return res.json(await this.webhookService.getMail(req.body));
	};

	getImeiRes = async (req, res) => {
		const orderId = randomString(6);
		const errorRes = {
			status: 3,
			error_code: '{ERROR_CODE}',
			response: '{ERROR_MESSAGE}',
		};
		const orderReject = {
			id: orderId,
			service_id: req.query.service_id,
			status: 3,
			status_display: 'Rejected',
			imei: req.query.imei,
			response: '{HTML_RESPONSE}',
		};
		const orderSuccess = {
			id: orderId,
			service_id: req.query.service_id,
			status: 4,
			status_display: 'Done',
			imei: req.query.imei,
			// data: RAW_DATA,
			response:
				'Model: iPhone 13 Pro Max<br>IMEI: 352396474678311<br>Find My iPhone: <font color=green>OFF</font>',
		};
		res.status(400).json(errorRes);
	};

	getHistory = async (req, res) => {
		return res.json(await this.webhookService.getHistory(req.body));
	};
}

module.exports = new WebhookController();
