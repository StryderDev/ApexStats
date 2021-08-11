const chalk = require('chalk');
const { DateTime } = require('luxon');
const { version, rotations } = require('../config.json');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');
const { getTime, mapImage } = require('../functions/map.js');

module.exports = {
	name: 'ready',
	once: false,
	execute(client) {
		const guild = client.guilds.cache.get(rotations.guild);
		if (!guild) return console.log(chalk`{gray Unable to find guild for Map Updates.}`);

		function updateMap() {
			axios.get(`https://fn.alphaleagues.com/v2/apex/map/?next=1`).then(response => {
				const data = response.data.arenas;

				const map = new MessageEmbed()
					.setDescription(
						`:map: The current arenas map is **${data.map}** for ${getTime(
							data.times.next,
						)}.\n:clock3: The next arenas map is **${data.next[0].map}** for ${
							data.next[0].duration
						} minutes.`,
					)
					.setFooter('Data provided by https://rexx.live/')
					.setImage(
						`https://cdn.apexstats.dev/ApexStats/Maps/Season_010/Arenas/${mapImage(
							data.map,
						)}.gif?q=${version}`,
					)
					.setTimestamp();

				const channel = guild.channels.cache.find(
					c => c.id === rotations.arenas.channel && c.type === 'GUILD_TEXT',
				);
				if (!channel) return console.log('Unable to find channel.');

				try {
					const message = channel.messages.fetch(rotations.arenas.message);
					if (!message) return console.log('Unable to find message.');

					channel.messages.fetch(rotations.arenas.message).then(msg => {
						msg.edit({ embeds: [map] });
					});

					console.log(chalk`{blueBright [${DateTime.local().toFormat('hh:mm:ss')}] Updated Arenas Embed}`);
				} catch (err) {
					console.error(`Other Error: ${err}`);
				}
			});
		}

		if (rotations.arenas.enabled == true) updateMap();

		setInterval(function () {
			if (rotations.arenas.enabled == true) {
				var date = new Date();

				if (date.getMinutes() % rotations.arenas.interval == 0) {
					updateMap();
				}
			}
		}, Math.max(1, 1 || 1) * 60 * 1000);
	},
};
