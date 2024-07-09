const { sendMail } = require('@/libs/mail/mail');
const { createHtmlFromTemplate, SUBJECT } = require('@/utils/teamplate.utils');

class PaymentEmail {
	createRechargeOptionForUser(
		{ first_name, last_name, email },
		{ paymentId, createdAt, paymentType, amount }
	) {
		const html = createHtmlFromTemplate(
			'src/libs/mail/emailTemplate/rechartSuccess.html',
			{
				user_name: `${first_name} ${last_name}`,
				rechart_user: email,
				rechart_id: paymentId,
				rechart_money: amount,
				rechart_method:
					paymentType === 'recharge' ? 'Nạp tiền ' : 'Hoàn tiền',
				rechart_createdAt: createdAt,
			}
		);
		const mailOptions = {
			from: process.env.MAIL,
			subject: SUBJECT,
			html,
			to: email,
		};
		return mailOptions;
	}

	sendRechargeEmail = async (
		{ first_name, last_name, email },
		{ paymentId, createdAt, paymentType, amount }
	) => {
		return await sendMail(
			this.createRechargeOptionForUser(
				{ first_name, last_name, email },
				{ paymentId, createdAt, paymentType, amount }
			)
		);
	};
}
module.exports = new PaymentEmail();
