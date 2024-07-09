class HttpException extends Error {
	constructor(status, message, errorCode = 400) {
		super(message);
		this.status = status;
		this.errorCode = errorCode;
	}
}
module.exports = HttpException;
