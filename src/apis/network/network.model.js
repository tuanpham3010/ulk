const { AppKeys } = require('@/common/const');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelName = 'Network';

const roleSchema = new Schema({
   title: {
      type: String,
      required: true,
   },
   key: {
      type: String,
      default: function() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = '';
        for (let i = 0; i < 6; i++) {
          key += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return key;
      },
      required: true,
      unique: true,
   }
}, {
   ...AppKeys.SCHEMA_OPTIONS
});

const Network = mongoose.model(modelName, roleSchema, modelName);

module.exports = Network;