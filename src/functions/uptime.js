const chalk = require('chalk');
const { client } = require('../Apex.js');

async function uptime() {
	(function loop() {
		const uptime = process.uptime();
		const seconds = Math.floor(uptime % 60);
		const minutes = Math.floor((uptime % (60 * 60)) / 60);
		const hours = Math.floor(uptime / (60 * 60)) % 24;
		const days = Math.floor(uptime / 86400);

		console.log(chalk`{blue [>>> Shard #${client.shard.ids[0] + 1} Uptime: ${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds]}`);

		now = new Date();
		var delay = 60000 - (now % 60000);
		setTimeout(loop, delay);
	})();
}

module.exports = { uptime };
