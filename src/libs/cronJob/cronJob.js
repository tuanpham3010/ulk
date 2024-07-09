const cron = require('cron');
class CronJob {
	static createCronJobWithTask(time, task) {
		const cronJob = new cron.CronJob(time, function () {
			let isFunction = typeof task === 'function';
			if (isFunction) {
				task();
			}
		});
		cronJob.start();
		return cronJob;
	}
}
module.exports = CronJob;
