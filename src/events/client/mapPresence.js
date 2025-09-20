const axios = require('axios');
const chalk = require('chalk');
const db = require('../../utilities/db.js');
const { ActivityType } = require('discord.js');

module.exports = {
	name: 'clientReady',
	once: true,
	execute(client) {
		(async function mapPresenceLoop() {
			const currentMinute = new Date().getMinutes();
			const currentSecond = new Date().getSeconds();

			if (currentMinute % process.env.PRESENCE_UPDATE == 0) {
				const brMap = axios.get(`https://solaris.apexstats.dev/beacon/map/br?key=${process.env.SPYGLASS}`);
				const rankedMap = axios.get(`https://solaris.apexstats.dev/beacon/map/ranked?key=${process.env.SPYGLASS}`);

				console.log(chalk.yellow(`${chalk.bold('[PRESENCE]')} Checking map index...`));

				await axios
					.all([brMap, rankedMap])
					.then(
						axios.spread((brMap, rankedMap) => {
							const brData = brMap.data;
							const rankedData = rankedMap.data;

							const getMapIndex = `SELECT brMapIndex from ApexStats_CurrentMapIndex WHERE id = ${client.shard.ids[0]}`;

							db.query(getMapIndex, (err, result) => {
								if (err) return console.log(chalk.red(`${chalk.bold('[PRESENCE]')} Query error: ${err.code}`));

								if (result[0].brMapIndex != brData.rotationIndex) {
									client.user.setActivity(`🌎 ${brData.map.name} / 🥇 ${rankedData.map.name}`, { type: ActivityType.Custom });

									console.log(chalk.green(`${chalk.bold('[PRESENCE]')} Updated bot presence, set to "${brData.map.name} / ${rankedData.map.name}"`));

									const updateMapIndex = `UPDATE ApexStats_CurrentMapIndex SET brMapIndex = ${brData.rotationIndex} WHERE id = ${client.shard.ids[0]}`;

									db.query(updateMapIndex, (err, result) => {
										if (err) return console.error(chalk.red(`${chalk.bold('[PRESENCE]')} Query error: ${err.code}`));

										console.log(chalk.green(`${chalk.bold('[PRESENCE]')} Updated map index to ${brData.rotationIndex}`));
									});
								} else {
									console.log(chalk.green(`${chalk.bold('[PRESENCE]')} Map index is the same as current index`));
								}
							});
						}),
					)
					.catch(err => {
						console.error(chalk.red(`${chalk.bold('[PRESENCE]')} Axios error: ${err}`));

						client.user.setActivity('Apex Legends', { type: ActivityType.Playing });
					});
			}

			var delay = 60000 - currentSecond * 1000;
			setTimeout(mapPresenceLoop, delay);
		})();
	},
};
