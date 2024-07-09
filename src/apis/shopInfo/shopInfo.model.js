const { setShopInfo } = require('@/libs/common/shopInfo');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelName = 'ShopInfo';
const socialSchema = new Schema({
	url: {
		type: String,
		default: '',
	},
	enable: {
		type: Boolean,
		default: true,
	},
});
const shopInfoSchema = new Schema(
	{
		name: {
			type: String,
			unique: true,
		},
		balance: {
			type: Number,
			require: true,
			default: 0,
			min: 0,
		},
		orderCount: {
			type: Number,
			default: 0,
		},
		emails: {
			type: Array,
			default: [],
		},
		bankAccount: {
			type: Number,
			require: true,
		},
		bankBin: {
			type: Number,
			require: true,
		},
		bankAccountName: {
			type: String,
			require: true,
		},
		banner: {
			textColor: {
				type: String,
				default: '#F5222D',
			},
			bannerColor: {
				type: String,
				default: '#fff',
			},
			bannerDuration: {
				type: Number,
				default: 15,
			},
			content: {
				type: String,
				default: '',
			},
			status: {
				type: Boolean,
				default: false,
			},
		},
		logoLink: {
			type: String,
		},
		tokenImeiApi: {
			type: String,
		},
		cassoKey: {
			type: String,
		},
		qrBankShop: {
			type: String,
		},
		appEmail: {
			type: String,
		},
		appEmailPass: {
			type: String,
		},
		contactPhone: {
			type: String,
		},
		contactEmail: {
			type: String,
		},
		contactFacebook: {
			type: socialSchema,
		},
		contactZalo: {
			type: socialSchema,
		},
		contactTelegram: {
			type: socialSchema,
		},
		logoLink: {
			type: String,
		},
	},
	{
		toJSON: {
			aliases: true,
			virtuals: true,
		},
		toObject: {
			virtuals: true,
			aliases: true,
		},
		timestamps: true,
		versionKey: false,
	}
);

//Hash password previous save

shopInfoSchema.post('findOneAndUpdate', (doc) => {
	setShopInfo(doc);
});

const ShopInfo = mongoose.model(modelName, shopInfoSchema, modelName);

// async function createInitialDocument() {
// 	try {
// 		const name = 'dongnv';
// 		// Kiểm tra xem có document trong collection hay chưa
// 		const existingDocument = await ShopInfo.findOne({ name, balance: 0 });

// 		if (!existingDocument) {
// 			// Tạo document ban đầu nếu không tìm thấy
// 			const initialDocument = await ShopInfo.create({ name });
// 			console.log('Created initial document:', initialDocument);
// 		} else {
// 			console.log('Document already exists:', existingDocument);
// 		}
// 	} catch (error) {
// 		console.error('Error creating initial document:', error);
// 	}
// }

// Gọi hàm để tạo document ban đầu
// createInitialDocument();

module.exports = ShopInfo;
