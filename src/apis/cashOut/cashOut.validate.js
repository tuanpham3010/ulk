const listBankMap = require('@/common/const/app.banks');
const { isObjectId } = require('@/utils/common.utils');
const Joi = require('joi');
const checkObjectId = (value, helpers) => {
	if (isObjectId(value)) return value;
	return helpers.error('id invalid');
};
const isCorrectBank = (value, helpers) => {
	if (listBankMap.get(`${value}`)) return value;
	return helpers.error('bank invalid');
};
const AMOUNT_MULTIPLE = 10000;
class CashOutValidate {
	static createCashOutSchema = Joi.object().keys({
		amount: Joi.number()
			.integer()
			.min(AMOUNT_MULTIPLE)
			.multiple(AMOUNT_MULTIPLE)
			.required(),
		user: Joi.string().custom(checkObjectId).required(),
		content: Joi.string().required(),
		bankBin: Joi.number().custom(isCorrectBank).required(),
		bankAccount: Joi.number().required(),
		bankAccountName: Joi.string().required(),
	});
	static completeStateSchema = Joi.string().valid(
		'fail',
		'success',
		'pending',
		'cancel'
	);
}

module.exports = CashOutValidate;
