const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelName = 'webhook';

const webhookSchema = new Schema(
	{
		headers: {},
		body: {},
		query: {},
		message:{
		}
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

const Webhook = mongoose.model(modelName, webhookSchema, modelName);

module.exports = Webhook;
