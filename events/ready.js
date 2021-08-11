const chalk = require('chalk');
const { DateTime } = require('luxon');
const axios = require('axios');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		const time = `[${DateTime.local().toFormat('hh:mm:ss')}]`;

		console.log(chalk`{yellow ${time} Logging in... }`);
		console.log(chalk`{green ${time} Logged in as ${client.user.username}}`);
		console.log(chalk`{yellow ${time} Cluster Count: ${client.cluster.count}}`);

		function updatePresence() {
			axios.get(`https://fn.alphaleagues.com/v2/apex/map/?next=1`).then(response => {
				const br = response.data.br;
				const arenas = response.data.arenas;

				client.user.setActivity(`on ${br.map}/${arenas.map}`, { type: 'PLAYING' });

				console.log(chalk`{blueBright ${time} Updated Presence}`);
			});
		}

		updatePresence();

		setInterval(function () {
			var date = new Date();

			if (date.getMinutes() % 10 == 0) {
				updatePresence();
			}
		}, Math.max(1, 1 || 1) * 60 * 1000);
	},
};
