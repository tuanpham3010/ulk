const mongoose = require('mongoose');
const Logger = require('@/libs/common/logger.service');

const { MONGO_URI } = process.env;

async function mongoDBConnect() {
   mongoose.connection.on('error', (err) => {
      Logger.log('Mongodb connection error:', err.message);
   }).once('open', () => {
      Logger.log('Mongodb connected');
   });

   mongoose.set({
      strictQuery: true,
      debug: false
   });
   // mongoose.sanitizeFilter({$and})
   await mongoose.connect(MONGO_URI);
}

module.exports = mongoDBConnect;