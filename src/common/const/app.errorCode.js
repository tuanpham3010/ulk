const errorCodes = {
	//register login error
	register_error: 101,
	email_exist: 102,
	phone_exist: 103,
	phone_password_invalid: 104,
	email_password_invalid: 105,
	password_invalid: 106,
	account_password_incorrect: 107,
	user_not_found: 108,
	password_fail: 109,
	//product error
	code_exit: 201,
	//cashOut error
	cash_out_not_enough_money: 301,
	cash_out_multiple: 302,
	cash_out_month: 303,
	cash_out_info_require: 304,
	//
	app_error: 400,
};

const listMessage = {
	register_error: 'register_error',
	email_exist: 'email_exist',
	phone_exist: 'phone_exist',
	phone_password_invalid: 'phone_password_invalid',
	email_password_invalid: 'email_password_invalid',
	password_invalid: 'password_invalid',
	account_password_incorrect: 'account_password_incorrect',
	user_not_found: 'user_not_found',
	password_fail: 'password_fail',
	change_password_success: 'change_password_success',
	code_exit: 'code_exit',
};
module.exports = { errorCodes, listMessage };
