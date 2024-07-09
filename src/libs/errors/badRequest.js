const HttpException = require('./httpException');

class BadRequestException extends HttpException {
	constructor(message, error) {
		super(400, message, error);
	}
}

module.exports = BadRequestException;
