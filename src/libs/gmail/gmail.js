const { getGoogleGmail } = require('@/configs/googleApi.config');
const { base64Reverse } = require('@/utils/base64.utils');

class Gmail {
	static async getGmail(data) {
		const res = await getGoogleGmail().users.messages.get(data);
		return res.data;
	}
	static async getHistory(data) {
		// const data = JSON.parse(base64Reverse(base64));
		const res = await getGoogleGmail().users.history.list(data);
		console.log(res);
		return res.data;
	}
	static async getLabel(data) {
		// const data = JSON.parse(base64Reverse(base64));
		const res = await getGoogleGmail().users.history.list(data);
		console.log(res);
		return res.data;
	}
}

module.exports = Gmail;
