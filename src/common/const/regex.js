/* eslint-disable no-useless-escape */
module.exports = Object.freeze({
	password: '^[a-zA-Z0-9]{3,30}$',
	vnPhoneNumber: /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
	descptionCasso:
		/naptien(0\d{9}|(\+?84|0)(3[2-9]|5[2689]|7[0|6-9]|8[1-6])\d{7})unlocker/,
});
