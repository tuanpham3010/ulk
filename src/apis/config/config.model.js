const { AppKeys } = require('@/common/const');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelName = 'config';

const userRechargeSchema = new Schema(
	{},
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

// const UserRecharge = mongoose.model(modelName, userRechargeSchema, modelName);

// module.exports = UserRecharge;
