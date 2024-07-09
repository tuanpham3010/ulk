const { sendMail } = require('@/libs/mail/mail');
const { createHtmlFromTemplate, SUBJECT } = require('@/utils/teamplate.utils');

class UserEmail {
	createResetPasswordOption({ first_name, last_name, email }, token) {
		const reset_password_link = `${process.env.FE_URI}/auth/reset-password/${token}`;
		const html = createHtmlFromTemplate(
			'src/libs/mail/emailTemplate/resetPassword.html',
			{
				reset_password_link,
				user_name: `${first_name} ${last_name}`,
			}
		);
		const mailOptions = {
			from: process.env.MAIL,
			to: email,
			subject: SUBJECT,
			html,
		};
		return mailOptions;
	}
	sendResetPasswordEmail = async (
		{ first_name, last_name, email },
		token
	) => {
		try {
			return await sendMail(
				this.createResetPasswordOption(
					{ first_name, last_name, email },
					token
				)
			);
		} catch (error) {
			//write here
		}
	};
}

module.exports = new UserEmail();
