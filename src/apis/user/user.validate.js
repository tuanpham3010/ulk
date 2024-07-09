const Joi = require('joi');
const { Regex } = require('../../common/const');
class UserValidate {
	static createUserSchema = Joi.object().keys({
		first_name: Joi.string().trim().required(),
		last_name: Joi.string().trim().required(),
		code: Joi.string().trim(),
		phone: Joi.string()
			.trim()
			.regex(Regex.vnPhoneNumber)
			.required()
			.allow(''),
		// address: Joi.string().trim().allow(''),
		email: Joi.string()
			.trim()
			.email({ tlds: { allow: false } })
			.required(),
		// password: Joi.string().regex(new RegExp(Regex.password)).required(),
		password: Joi.string().required(),
		// confirmPassword: Joi.ref('password')
	});
	static passwordSchema = Joi.string().min(6).required();
	static loginUserSchema = Joi.object().keys({
		email: Joi.string()
			.trim()
			.email({ tlds: { allow: false } })
			.required(),
		password: Joi.string().required(),
		// confirmPassword: Joi.ref('password')
	});
	static loginPhoneUserSchema = Joi.object().keys({
		phone: Joi.string().trim().regex(new RegExp(Regex.vnPhoneNumber)),
		password: Joi.string().required(),
		// confirmPassword: Joi.ref('password')
	});
}

module.exports = UserValidate;
