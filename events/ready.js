const chalk = require('chalk');
const { DateTime } = require('luxon');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		const time = `[${DateTime.local().toFormat('hh:mm:ss')}]`;

		console.log(chalk`{yellow ${time} Logging in... }`);
		console.log(chalk`{green ${time} Logged in as ${client.user.username}}`);
		console.log(chalk`{yellow ${time} Cluster Count: ${client.cluster.count}}`);

		client.user.setActivity('Titanfall Approaching Battlefield', { type: 'WATCHING' });
	},
};
