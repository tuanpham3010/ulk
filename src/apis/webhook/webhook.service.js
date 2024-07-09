const { getGoogleGmail } = require('@/configs/googleApi.config');
const Webhook = require('./webhook.model');
const Gmail = require('@/libs/gmail/gmail');
const { base64Reverse } = require('@/utils/base64.utils');

class WebhookService {
	async saveResult({ headers, body, query }) {
		try {
			const newest = await Webhook.findOne(
				{},
				{},
				{ sort: { createdAt: -1 } }
			);
			if (body?.message?.data) {
				await Webhook.create({ headers, body, query });
			}
			const { historyId } = base64Reverse(newest.body.message.data);
			const htr = await Gmail.getHistory({
				userId: 'me',
				startHistoryId: historyId,
				// labelId: 'INBOX',
				historyTypes: 'messageAdded',
			});
			const messageId = htr.history[0].messages[0].id;
			const message = await Gmail.getGmail({
				userId: 'me',
				id: messageId,
				format: 'minimal',
			});
			// console.log(message); // mail
		} catch (e) {
			console.log(e);
		} finally {
			return {
				success: true,
			};
		}
	}
	async dongtest() {
		const gmail = getGoogleGmail();
		const res = await gmail.users.labels.list({
			userId: 'me',
		});
		console.log('dongtest', res);
		return { success: true };
	}
	async getMail(data) {
		const result = await Gmail.getGmail(data);
		// await Webhook.findOneAndUpdate(
		// 	{ 'body.messageId': messageId },
		// 	{ message: result }
		// );
		return result;
	}
	async getHistory(data) {
		const result = await Gmail.getHistory(data);
		// await Webhook.findOneAndUpdate(
		// 	{ 'body.messageId': messageId },
		// 	{ message: result }
		// );
		return result;
	}
}
module.exports = WebhookService;
