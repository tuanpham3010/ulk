const bcrypt = require('bcrypt');
const { AppConsts } = require('@/common/const');

class BcryptLib {
	static async hash(data) {
		try {
			const salt = await bcrypt.genSalt(AppConsts.BCRYPT_SALT_ROUND);
			const dataHashed = await bcrypt.hash(data, salt);
			return dataHashed;
		} catch (error) {
			throw error;
		}
	}

	static async compare(dataEncoded, dataCompare) {
		try {
			const isEquals = await bcrypt.compare(dataCompare, dataEncoded);
			return isEquals;
		} catch (error) {
			throw error;
		}
	}
}

module.exports = BcryptLib;
