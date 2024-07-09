const Logger = require('@/libs/common/logger.service');
const nodemailer = require('nodemailer');
let transporter = {};

function setTransporter(user, pass) {
	transporter = nodemailer.createTransport({
		service: 'Gmail', // true for 465, false for other ports
		auth: {
			user,
			pass,
		},
	});
	Logger.writeLog('info', {
		message: 'success set up nodemailer',
	});
}
function getTransporter() {
	return transporter;
}

module.exports = { setTransporter, getTransporter };
