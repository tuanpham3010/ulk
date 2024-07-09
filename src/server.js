const http = require('http');
const app = require('./app');
const { AppConsts } = require('./common/const');
const Logger = require('./libs/common/logger.service');

const PORT = process.env.PORT ?? 5000;
const HOST = process.env.HOST ?? 'localhost';

const server = http.createServer(app);

server.listen(PORT, HOST, () => {
	const runMode = process.env.NODE_ENV;
	const baseUrl = `http://${server.address().address}:${
		server.address().port
	}`;
	Logger.log(`Running with mode: ${runMode}!`);
	Logger.log(`Server is running at: ${baseUrl}`);
	Logger.log(
		`Api base url: ${baseUrl}${AppConsts.API_PREFIX}/${process.env.API_VERSION}`
	);
});
