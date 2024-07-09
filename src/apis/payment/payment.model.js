const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelName = 'userRecharge';

const userRechargeSchema = new Schema(
	{
		paymentId: {
			type: String,
			required: true,
			unique: true,
			immutable: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			immutable: true,
		},
		info: {
			type: Schema.Types.Mixed,
			required: true,
			immutable: true,
		},
		paymentType: {
			type: String,
			enum: ['recharge', 'refund'],
			required: true,
		},
		state: {
			type: String,
			enum: ['pending', 'success', 'fail'],
			default: 'pending',
		},
		amount: {
			type: Number,
			required: true,
			immutable: true,
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

const UserRecharge = mongoose.model(modelName, userRechargeSchema, modelName);

module.exports = UserRecharge;
