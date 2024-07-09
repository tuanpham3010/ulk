const HttpException = require('./httpException');

class ForbiddenException extends HttpException {
    constructor(message) {
        super(403, message);
    }
}

module.exports = ForbiddenException;
