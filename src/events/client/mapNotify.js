const axios = require('axios');
const chalk = require('chalk');
const db = require('../../utilities/db.js');
const { EmbedBuilder } = require('discord.js');
const { emoteFile, nextMapLength } = require('../../utilities/misc.js');

const emotes = require(`../../data/${emoteFile(process.env.DEBUG)}Emotes.json`);

module.exports = {
	name: 'clientReady',
	once: true,
	execute(client) {
		(async function mapNotifyLoop() {
			const currentSecond = new Date().getSeconds();

			const getReminders = 'SELECT * FROM ApexStats_MapReminders WHERE expired = 0 LIMIT 5';

			db.query(getReminders, async (err, result) => {
				if (err) return console.log(chalk.red(`${chalk.bold('[NOTIFY]')} Query error: ${err.code}`));

				if (result.length > 0) {
					console.log(chalk.yellow(`${chalk.bold('[NOTIFY]')} Checking map reminders...`));

					for (const reminder of result) {
						const rowId = reminder.id;
						const mapType = reminder.map_type;
						const userId = reminder.user_id;
						const channelId = reminder.channel_id;
						const serverId = reminder.server_id;
						const mapIndex = reminder.map_index;

						await axios
							.get(`https://solaris.apexstats.dev/beacon/map/${mapType}?next=1&key=${process.env.SPYGLASS}`)
							.then(async res => {
								const map = res.data;
								const mapInfo = map.map;

								// if map index from DB is equal to the map index from the API, skip the reminder
								if (mapIndex == map.rotationIndex) return console.log(chalk.yellow(`${chalk.bold('[NOTIFY]')} Map index is the same, skipping...`));

								const mapImage = mapInfo.name.replace(/ /g, '').replace(/'/g, ''); // Remove spaces and single quotes from name for image URL
								const mapNextString = map.next[0] ? `\n${emotes.listArrow} Up Next: **${map.next[0].map.name}** for ${nextMapLength(map.next[0].duration)}` : ``;

								const mapEmbed = new EmbedBuilder()
									.setTitle(`${emotes.online} ${mapInfo.type} - ${mapInfo.name}`)
									.setDescription(`${emotes.listArrow} **${mapInfo.name}** ends <t:${map.times.nextMap}:R> at <t:${map.times.nextMap}:t> ${mapNextString}`)
									.setFooter({ text: 'Times are automatically converted to your local time' });

								// fetch the guild and channel from the DB
								const guild = client.guilds.cache.get(serverId);
								const channel = guild.channels.cache.get(channelId);

								if (!guild) return console.log(chalk.red(`${chalk.bold('[NOTIFY]')} Guild not found for server ID: ${serverId}`));

								if (!channel) return console.log(chalk.red(`${chalk.bold('[NOTIFY]')} Channel not found for channel ID: ${channelId}`));

								// check if the channel is a text channel and we have permission to send messages
								if (channel.type == 0 && channel.permissionsFor(guild.members.me).has('SendMessages')) {
									await channel.send({ content: `<@${userId}> ${mapInfo.type} map has changed`, embeds: [mapEmbed] });
								} else {
									console.log(chalk.red(`${chalk.bold('[NOTIFY]')} Channel is not a text channel or missing permissions`));
								}

								// update the reminder to be expired
								const updateQuery = 'UPDATE ApexStats_MapReminders SET expired = 1 WHERE id = ?';

								db.query(updateQuery, [rowId], (err, result) => {
									if (err) return console.log(chalk.red(`${chalk.bold('[NOTIFY]')} Query error: ${err.code}`));

									console.log(chalk.green(`${chalk.bold('[NOTIFY]')} Map reminder expired for user ID: ${userId} in channel ID: ${channelId} for server ID: ${serverId}`));
								});
							})
							.catch(err => {
								return console.error(chalk.red(`${chalk.bold('[NOTIFY]')} Axios error: ${err}`));
							});
					}
				}
			});

			var delay = 60000 - currentSecond * 1000;
			setTimeout(mapNotifyLoop, delay);
		})();
	},
};
