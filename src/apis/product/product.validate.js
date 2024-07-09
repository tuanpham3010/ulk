const { isObjectId } = require('@/utils/common.utils');
const Joi = require('joi');
const checkObjectId = (value, helpers) => {
	if (isObjectId(value)) return value;
	return helpers.error('product invalid');
};
class ProductValidate {
	static createProductSchema = Joi.object().keys({
		title: Joi.string().trim().required(),
		code: Joi.string().trim(),
		estimated_time: Joi.string(),
		description: Joi.string().trim().required(),
		// password: Joi.string().regex(new RegExp(Regex.password)).required(),
		price: Joi.number().required(),
		brand: Joi.string().custom(checkObjectId).required(),
		show_home: Joi.boolean().required(),
		status: Joi.boolean().required(),
		isAuto: Joi.boolean().required(),
		serviceAutoId: Joi.when('isAuto', {
			is: true,
			then: Joi.number().required(),
			otherwise: Joi.number(),
		}),
	});
}

module.exports = ProductValidate;
