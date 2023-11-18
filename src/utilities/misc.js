const chalk = require('chalk');

function uptime(client) {
	(function loop() {
		const uptime = process.uptime();
		const seconds = `${Math.floor(uptime % 60)} Seconds`;
		const minutes = `${Math.floor((uptime % (60 * 60)) / 60)} Minutes`;
		const hours = `${Math.floor((uptime / (60 * 60)) % 24)} Hours`;
		const days = `${Math.floor(uptime / 86400)} Days`;

		if (client.shard.ids[0] === 0) {
			console.log(chalk.blue(`${chalk.bold('[BOT]')} Uptime: ${days}, ${hours}, ${minutes}, ${seconds}`));
		}

		now = new Date();
		var delay = 60000 - (now % 60000);
		setTimeout(loop, delay);
	})();
}

module.exports = { uptime };
