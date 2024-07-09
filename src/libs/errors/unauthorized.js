const HttpException = require('./httpException');

class UnauthorizedException extends HttpException {
    constructor(message) {
        super(401, message);
    }
}

module.exports = UnauthorizedException;
