const chalk = require('chalk');
const { DateTime } = require('luxon');
const config = require('../config.json');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'ready',
	once: false,
	execute(client) {
		const guild = client.guilds.cache.get(config.rotations.guild);
		if (!guild) return console.log(chalk`{gray Unable to find guild for Map Updates.}`);

		function updateMap() {
			axios.get(`https://fn.alphaleagues.com/v2/apex/map/?next=1`).then(response => {
				const data = response.data.br;

				function getTime(timestamp) {
					var time = Math.floor(Date.now() / 1000);
					var seconds = timestamp - time;

					var hours = Math.floor(seconds / 3600) % 24;
					var minutes = Math.floor(seconds / 60) % 60;
					var seconds = Math.floor(seconds) % 60;

					return `${hours} hours, ${minutes} minutes`;
				}

				const map = new MessageEmbed()
					.setDescription(
						`The current map is **${data.map}** for ${getTime(data.times.next)}.\nThe next map is **${
							data.next[0].map
						}** for ${data.next[0].duration} minutes.\nThe current ranked map is **${data.ranked.map}**.`,
					)
					.setFooter('Data provided by https://rexx.live/')
					.setTimestamp();

				const channel = guild.channels.cache.find(
					c => c.id === config.rotations.map.channel && c.type === 'GUILD_TEXT',
				);
				if (!channel) return console.log('Unable to find channel.');

				try {
					const message = channel.messages.fetch(config.rotations.map.message);
					if (!message) return console.log('Unable to find message.');

					channel.messages.fetch(config.rotations.map.message).then(msg => {
						msg.edit({ embeds: [map] });
					});

					console.log(chalk`{blueBright [${DateTime.local().toFormat('hh:mm:ss')}] Updated Map Embed}`);
				} catch (err) {
					console.error(`Other Error: ${err}`);
				}
			});
		}

		if (config.rotations.map.enabled == true) updateMap();

		setInterval(function () {
			if (config.rotations.map.enabled == true) {
				var date = new Date();

				if (date.getMinutes() % config.rotations.map.interval == 0) {
					updateMap();
				}
			}
		}, Math.max(1, 1 || 1) * 60 * 1000);
	},
};
