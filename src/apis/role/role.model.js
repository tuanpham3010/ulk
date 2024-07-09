const { AppKeys } = require('@/common/const');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelName = 'Role';

const roleSchema = new Schema({
   name: {
      type: String,
      required: true,
      unique: true,
      enum: ['user', 'admin', 'moderator']
   }
}, {
   ...AppKeys.SCHEMA_OPTIONS
});

const Role = mongoose.model(modelName, roleSchema, modelName);

module.exports = Role;