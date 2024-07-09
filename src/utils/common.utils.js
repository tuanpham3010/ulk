const { descptionCasso } = require('@/common/const/regex');
const { BadRequest } = require('@/libs/errors');
const mongoose = require('mongoose');
class CommonUtils {
	/**
	 * @param {any} data
	 * @returns {string} return a string one of the values: String, Symbol, Number, Object, Array, Null ,Undefined,...
	 */
	static typeOf(data) {
		return Object.prototype.toString.call(data).slice(8, -1);
	}
	// static randomString(a, b) {
	// 	const numberSequence = Array.from({ length: a }, () =>
	// 		Math.floor(Math.random() * 10)
	// 	);
	// 	// Tạo một mảng số tự nhiên ngẫu nhiên
	// 	const letterSequence = Array.from({ length: b }, () => {
	// 		const alphabet = 'abcdefghijklmnopqrstuvwxyz';
	// 		return alphabet[Math.floor(Math.random() * alphabet.length)]; // Lấy một kí tự chữ cái ngẫu nhiên
	// 	});

	// 	const result = numberSequence.join('') + '-' + letterSequence.join(''); // Nối dãy số và dãy kí tự bằng dấu '-'
	// 	return result;
	// }
	static randomString(length = 6) {
		const charset =
			'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let result = '';

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * charset.length);
			result += charset.charAt(randomIndex);
		}

		return result;
	}
	static formatDateToNumericString(date = new Date()) {
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, nên cộng thêm 1
		const year = String(date.getFullYear()).slice(-2); // Lấy hai chữ số cuối của năm
		const numericString = hours + minutes + seconds + day + month + year;
		return numericString;
	}

	static removeKeyOBject(keys = [], object) {
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (key in object) {
				delete object[key];
			}
		}
		return object;
	}

	static stringToObjectId(str) {
		try {
			const objectId = mongoose.Types.ObjectId(str);
			return objectId;
		} catch (error) {
			console.error('Invalid ObjectId string:', str);
			return null;
		}
	}
	static isObjectId(str) {
		return mongoose.Types.ObjectId.isValid(str);
	}
	static getPhoneFromCassoDes(des = '') {
		const match = des.match(descptionCasso);

		if (match) {
			const phoneNumber = match[1];
			return phoneNumber;
		} else {
			return null;
		}
	}
	static adjustStringLength(string, desiredLength = 2) {
		string = `${string}`;
		if (string?.length === desiredLength) {
			return string;
		} else if (string?.length > desiredLength) {
			return string.slice(-desiredLength);
		} else {
			let zerosToAdd = desiredLength - string?.length;
			let adjustedString = '0'.repeat(zerosToAdd) + string;
			return adjustedString;
		}
	}
	static generateRechargeMessage(phone) {
		if (!phone) throw new BadRequest('not phone');
		return `naptien${phone}unlocker`;
	}
	static decimalToHex(decimal) {
		let hex = '';
		while (decimal > 0) {
			const remainder = decimal % 16;
			hex = remainder.toString(16).toUpperCase() + hex;
			decimal = Math.floor(decimal / 16);
		}
		return hex;
	}

	// Ví dụ sử dụng hàm

	static generateId(text, length = 4) {
		const currentTime = new Date();
		const currentDay = currentTime.getDate();
		const currentMonth = currentTime.getMonth() + 1;
		const currentYear = currentTime.getFullYear();
		const ddmmyy = `${CommonUtils.adjustStringLength(
			currentDay
		)}${CommonUtils.adjustStringLength(
			currentMonth
		)}${CommonUtils.adjustStringLength(currentYear)}`;
		const hex = CommonUtils.decimalToHex(ddmmyy);

		return hex + '-' + CommonUtils.adjustStringLength(text, length);
	}
}

module.exports = CommonUtils;
