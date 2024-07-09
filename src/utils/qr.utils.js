const { BadRequest } = require('@/libs/errors');
const { adjustStringLength } = require('./common.utils');

class QrUtils {
	static calculateCRC16CCITT(data) {
		const polynomial = 0x1021;
		let crc = 0xffff;

		for (let i = 0; i < data.length; i++) {
			const byte = data.charCodeAt(i);
			crc ^= byte << 8;

			for (let j = 0; j < 8; j++) {
				if ((crc & 0x8000) !== 0) {
					crc = (crc << 1) ^ polynomial;
				} else {
					crc = crc << 1;
				}
			}
		}
		return crc & 0xffff;
	}

	static generateQr({ bankBin = '', bankAccount = '', message = '' }) {
		bankAccount = bankAccount.toString();
		bankBin = bankBin.toString();
		message = message.toString();
		if (!(bankBin || bankAccount || message)) {
			throw new BadRequest('data invalid');
		}
		const mechantBankInfoLength =
			`0010A00000072701240006${bankBin}01${bankAccount?.length}${bankAccount}0208QRIBFTTA`
				.length;
		// const mechantBankInfoLength = `0010A00000072701240006${bankBin}01${bankAccount.length}${bankAccount}0208QRIBFTTA`

		const data = `00020101021238${mechantBankInfoLength}0010A000000727012${mechantBankInfoLength
			.toString()
			.slice(1)}0006${bankBin}01${adjustStringLength(
			bankAccount.length
		)}${bankAccount}0208QRIBFTTA53037045802VN62${
			message.length + 4
		}08${adjustStringLength(message.length)}${message}6304`;
		return (
			data +
			adjustStringLength(
				QrUtils.calculateCRC16CCITT(data).toString(16),
				4
			)
		);
	}
	static generateQrWithMoney({
		bankBin = '',
		bankAccount = '',
		message = '',
		money,
	}) {
		bankAccount = bankAccount.toString();
		bankBin = bankBin.toString();
		message = message.toString();
		if (!(bankBin || bankAccount || message)) {
			throw new BadRequest('data invalid');
		}
		const mechantBankInfoLength =
			`0010A00000072701240006${bankBin}01${bankAccount?.length}${bankAccount}0208QRIBFTTA`
				.length;
		// const mechantBankInfoLength = `0010A00000072701240006${bankBin}01${bankAccount.length}${bankAccount}0208QRIBFTTA`

		const data = `00020101021238${mechantBankInfoLength}0010A000000727012${mechantBankInfoLength
			.toString()
			.slice(1)}0006${bankBin}01${adjustStringLength(
			bankAccount.length
		)}${bankAccount}0208QRIBFTTA53037045802VN62${
			message.length + 4
		}08${adjustStringLength(message.length)}${message}6304`;
		return (
			data +
			adjustStringLength(
				QrUtils.calculateCRC16CCITT(data).toString(16),
				4
			)
		);
	}
}

module.exports = QrUtils;
