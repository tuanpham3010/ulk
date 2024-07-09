const HttpException = require('./httpException');

class ErrorStatus200 extends HttpException {
	constructor(message) {
		super(200, message);
	}
}

module.exports = ErrorStatus200;
