const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelName = 'Order';
const noIdOption = { _id: false };
const infoSchema = new mongoose.Schema(
	{
		type: { type: String, required: true, enum: ['serial', 'imei'] },
		value: { type: String, required: true },

		// Thêm các quy tắc kiểm tra khác tùy ý
	},
	noIdOption
);
const resultSchema = new mongoose.Schema(
	{
		resultMessage: { type: String },
		resultText: { type: String },
		// Thêm các quy tắc kiểm tra khác tùy ý
	},
	noIdOption
);
const orderSchema = new Schema(
	{
		orderId: {
			type: String,
			required: true,
			immutable: true,
			unique: true,
		},
		service: {
			type: Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
			immutable: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			immutable: true,
		},
		state: {
			type: String,
			enum: ['pending', 'success', 'fail'],
			default: 'pending',
		},
		result: {
			type: resultSchema,
			default: {},
		},
		moneyPay: {
			type: Number,
			required: true,
			immutable: true,
		},
		autoResponse: {
			type: Schema.Types.Mixed,
			default: {},
		},
		autoOrderId: {
			type: String,
			unique: true,
			sparse: true,
		},
		autoState: {
			type: String,
			enum: ['pending', 'success', 'fail', 'none'],
			required: true,
		},
		endTime: {
			type: Date, //time success or cancel
		},
		isRefund: {
			type: Boolean,
			default: false,
		},
		paymentStatus: {
			type: String,
			enum: ['success', 'fail'],
			required: true,
		},
		info: {
			type: infoSchema,
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
const Order = mongoose.model(modelName, orderSchema, modelName);

module.exports = Order;
