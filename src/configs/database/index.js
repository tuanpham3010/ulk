const { redisConnect } = require('./redis.config');
const mongoDBConnect = require('./mongodb.config');
const Logger = require('@/libs/common/logger.service');

async function databaseConfig() {
   try {
      mongoDBConnect();
      redisConnect();
   } catch (error) {
      Logger.log('Database config error:', error);
   }
}

module.exports = databaseConfig;