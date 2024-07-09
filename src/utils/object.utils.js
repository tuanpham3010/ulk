const { default: mongoose } = require('mongoose');

class ObjectUtils {
	static stringToObjectId(string = '') {
		return mongoose.Types.ObjectId(string);
	}
	static mongooseDocToObject(data) {
		return Array.isArray(data)
			? data.map((item) => item.toObject())
			: data.toObject();
	}
}

module.exports = ObjectUtils;
