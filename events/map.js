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
				const data = response.data.br;

				const map = new MessageEmbed()
					.setDescription(
						`:map: The current map is **${data.map}** for ${getTime(
							data.times.next,
						)}.\n:clock3: The next map is **${data.next[0].map}** for ${
							data.next[0].duration
						} minutes.\n:fire: The current ranked map is **${data.ranked.map}**.`,
					)
					.setFooter('Data provided by https://rexx.live/')
					.setImage(
						`https://cdn.apexstats.dev/ApexStats/Maps/Season_010/BR/${mapImage(data.map)}.gif?q=${version}`,
					)
					.setTimestamp();

				const channel = guild.channels.cache.find(
					c => c.id === rotations.map.channel && c.type === 'GUILD_TEXT',
				);
				if (!channel) return console.log('Unable to find channel.');

				try {
					const message = channel.messages.fetch(rotations.map.message);
					if (!message) return console.log('Unable to find message.');

					channel.messages.fetch(rotations.map.message).then(msg => {
						msg.edit({ embeds: [map] });
					});

					console.log(chalk`{blueBright [${DateTime.local().toFormat('hh:mm:ss')}] Updated Map Embed}`);
				} catch (err) {
					console.error(`Other Error: ${err}`);
				}
			});
		}

		if (rotations.map.enabled == true) updateMap();

		setInterval(function () {
			if (rotations.map.enabled == true) {
				var date = new Date();

				if (date.getMinutes() % rotations.map.interval == 0) {
					updateMap();
				}
			}
		}, Math.max(1, 1 || 1) * 60 * 1000);
	},
};
