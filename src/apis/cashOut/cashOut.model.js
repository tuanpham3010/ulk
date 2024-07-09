const { AppKeys } = require('@/common/const');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelName = 'CashOutRequest';

const schema = new Schema(
	{
		amount: {
			type: Number,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			immutable: true,
		},
		content: { type: String, required: true },
		state: {
			type: String,
			enum: ['pending', 'fail', 'success', 'cancel'],
			default: 'pending',
		},
		messageForUser: {
			type: String,
		},
		requestId: {
			type: String,
			immutable: true,
			required: true,
		},
		bankBin: { type: String, required: true },
		bankAccount: {
			type: String,
			required: true,
		},
		bankAccountName: {
			type: String,
			required: true,
		},
		qrCode: {
			type: String,
			required: true,
		},
		completeTime: {
			type: Date,
		},
	},
	{
		...AppKeys.SCHEMA_OPTIONS,
	}
);

const CashOutRequest = mongoose.model(modelName, schema, modelName);

module.exports = CashOutRequest;
