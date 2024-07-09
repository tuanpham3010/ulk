const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelName = 'Product';

const productSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		code: {
			type: String,
			unique: true,
			required: true,
			trim: true,
			immutable: true,
		},
		estimated_time: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		// type: {
		// 	type: Schema.Types.ObjectId,
		// 	ref: 'ServiceType',
		// 	required: true,
		// },
		price: {
			type: Number,
			required: true,
		},
		brand: {
			type: Schema.Types.ObjectId,
			ref: 'Network',
			required: true,
		},
		image: {
			type: String,
		},
		serviceAutoId: {
			type: Number,
			// required: true,
		},
		status: {
			type: Boolean,
			required: true,
		},
		isAuto: {
			type: Boolean,
			required: true,
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

const Product = mongoose.model(modelName, productSchema, modelName);

module.exports = Product;
