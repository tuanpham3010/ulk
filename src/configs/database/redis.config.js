const { Redis } = require('ioredis');
const Logger = require('@/libs/common/logger.service');

const redisURI = process.env.REDIS_URI;
const redisClient = new Redis(redisURI, {});

async function redisConnect() {
   redisClient.on('connect', () => {
      Logger.log('Redis connected');
   });

   redisClient.once('ready', () => {
      Logger.log('Redis ready!');
   });

   redisClient.once('error', (err) => {
      Logger.log('Redis connect error:', err);
   });
}

module.exports = {
   redisConnect,
   redisClient
};
