const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BcryptLib = require('@/libs/hash/bcrypt');

const modelName = 'User';
const userSchema = new Schema(
	{
		email: {
			type: String,
			unique: true,
			required: true,
		},
		phone: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		first_name: {
			type: String,
		},
		last_name: {
			type: String,
		},
		role: {
			type: String,
			required: true,
		},
		balance: {
			type: Number,
			required: true,
			default: 0,
		},
		qrCode: '',
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

const fullNameVirtual = userSchema.virtual('fullname');
// eslint-disable-next-line no-unused-vars
fullNameVirtual.get(function (value, virtual, doc) {
	return this.first_name + ' ' + this.last_name;
});

// eslint-disable-next-line no-unused-vars
fullNameVirtual.set(function (value, virtual, doc) {
	const parts = value.split(' ');
	this.first_name = parts[0];
	this.last_name = parts[1];
});

//Hash password previous save
userSchema.pre('save', async function (next) {
	if (this.password) {
		this.password = await BcryptLib.hash(this.password);
	} else throw new Error('Password invalid');
	next();
});

userSchema.pre('updateOne', async function (next) {
	const password = this?._update?.password;
	if (password) this._update.password = await BcryptLib.hash(password);
	next();
});

const User = mongoose.model(modelName, userSchema, modelName);

module.exports = User;
