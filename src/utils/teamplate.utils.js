const fs = require('fs');
const FE_URI = process.env.FE_URI;

class TeamplateUtils {
	static SUBJECT = 'Thông báo từ 1unlocking';

	static convertTextToHTML(text = '') {
		// Tách văn bản thành các dòng
		const lines = text.split('\n');

		// Tạo chuỗi HTML bằng cách thêm các thẻ <p> cho từng dòng
		const html = lines
			.map((line) => {
				return `<p>${line}</p>`;
			})
			.join('');

		return html;
	}
	static createHtmlFromTemplate(url, data) {
		const globalData = {
			FE_URI,
			LOGO_LINK: `${FE_URI}/logo.jpg`,
			...data,
		};
		const fileContent = fs.readFileSync(url);
		const html = fileContent
			.toString()
			.replace(/\[(.+?)\]/g, (match, p1) => {
				return globalData[p1];
			});
		return html;
	}
}

module.exports = TeamplateUtils;
