const chalk = require('chalk');

function uptime(client) {
	(function uptimeLoop() {
		const uptime = process.uptime();
		const minutes = `${Math.floor((uptime % (60 * 60)) / 60)} Minutes`;
		const hours = `${Math.floor((uptime / (60 * 60)) % 24)} Hours`;
		const days = `${Math.floor(uptime / 86400)} Days`;

		if (client.shard.ids[0] === 0) console.log(chalk.blue(`${chalk.bold('[BOT]')} Uptime: ${days}, ${hours}, ${minutes}`));

		now = new Date();
		var delay = 60000 - (now % 60000);
		setTimeout(uptimeLoop, delay);
	})();
}

module.exports = { uptime };
