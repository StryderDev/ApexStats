const axios = require('axios');
const chalk = require('chalk');
const { ActivityType } = require('discord.js');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		(async function mapPresenceLoop() {
			const currentMinute = new Date().getMinutes();
			const currentSecond = new Date().getSeconds();

			if (currentMinute % 5 == 0) {
				const brMap = axios.get(`https://solaris.apexstats.dev/beacon/map/br?key=${process.env.SPYGLASS}`);
				const rankedMap = axios.get(`https://solaris.apexstats.dev/beacon/map/ranked?key=${process.env.SPYGLASS}`);

				console.log(chalk.yellow(`${chalk.bold('[PRESENCE]')} Updating presence...`));

				await axios.all([brMap, rankedMap]).then(
					axios.spread((brMap, rankedMap) => {
						const brMapName = brMap.data.map;
						const rankedMapName = rankedMap.data.map;

						client.user.setActivity(`${brMapName} / ${rankedMapName}`, { type: ActivityType.Custom });

						console.log(chalk.green(`${chalk.bold('[PRESENCE]')} Updated presence to "${brMapName} / ${rankedMapName}"`));
					}),
				);
			}

			var delay = 60000 - currentSecond * 1000;
			setTimeout(mapPresenceLoop, delay);
		})();
	},
};
