const HttpException = require('./httpException');

class ServerError extends HttpException {
   constructor(message = 'Server internal error!') {
      super(500, message);
   }
}

module.exports = ServerError;