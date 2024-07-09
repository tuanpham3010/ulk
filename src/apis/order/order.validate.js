const Joi = require('joi');
class UserValidate {
	static monthSchema = Joi.number().min(1).max(12).required();
}

module.exports = UserValidate;
