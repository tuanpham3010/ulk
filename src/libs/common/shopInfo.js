const { setTransporter } = require('@/configs/mail.config');

let shopInfo = {};

const getShopInfo = () => {
	return shopInfo;
};

const setShopInfo = (data = {}) => {
	// if(data.appEmail===data)
	shopInfo = data;
	setTransporter(data.appEmail, data.appEmailPass);
};


module.exports = {
	getShopInfo,
	setShopInfo,
};
