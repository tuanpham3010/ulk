const HttpException = require("./httpException");

class ConflictException extends HttpException {
    constructor(message) {
        super(400, message);
    }
}

module.exports = ConflictException;
