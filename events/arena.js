const client = require('../Apex.js');
const chalk = require('chalk');
const { DateTime, Duration } = require('luxon');
const axios = require('axios');
const config = require('../config.json');
const { MessageEmbed } = require('discord.js');
const { version } = require('../package.json');

client.once('ready', () => {
	const guild = client.guilds.cache.get(config.autoUpdate.guild);
	if (!guild) return console.log(chalk`{gray Unable to find guild for Map Updates.}`);

	function updateMap() {
		axios.get('https://fn.alphaleagues.com/v2/apex/map/?next=1').then(result => {
			var map = result.data.arenas;
			var next = map.next;

			const pluralize = (count, noun, suffix = 's') => `${count} ${noun}${count !== 1 ? suffix : ''}`;

			function getTime(time) {
				var now = DateTime.local();
				var nowSeconds = Math.floor(DateTime.local().toSeconds());
				var math = time - nowSeconds;
				var future = DateTime.local().plus({ seconds: math + 60 });

				var timeUntil = future.diff(now, ['hours', 'minutes', 'seconds']);

				var time = timeUntil.toObject();

				return `${pluralize(time.hours, 'hour')}, ${pluralize(time.minutes, 'minute')}`;
			}

			function removeSpaces(string) {
				return string.replace(/ /g, '');
			}

			const mapEmbed = new MessageEmbed()
				.setDescription(
					`:map: The current map is **${map.map}** for ${getTime(
						map.times.next,
					)}.\n:clock1: The next map is **${next[0].map}** and lasts for ${Duration.fromMillis(
						next[0].duration * 60 * 1000,
					).toFormat("m' minutes.'")}`,
				)
				.setImage(
					`https://cdn.apexstats.dev/Maps/Season%209/Arena_${removeSpaces(map.map)}_01.gif?v=${version}`,
				)
				.setTimestamp()
				.setFooter('Provided by https://rexx.live/');

			const guild = client.guilds.cache.get(config.autoUpdate.guild);
			if (!guild) return console.log('Unable to find guild.');

			const channel = guild.channels.cache.find(
				c => c.id === config.autoUpdate.arena.channel && c.type === 'GUILD_TEXT',
			);
			if (!channel) return console.log('Unable to find channel.');

			try {
				const message = channel.messages.fetch(config.autoUpdate.arena.message);
				if (!message) return console.log('Unable to find message.');

				channel.messages.fetch(config.autoUpdate.arena.message).then(msg => {
					msg.edit({ embeds: [mapEmbed] });
				});

				console.log(chalk`{blueBright [${DateTime.local().toFormat('hh:mm:ss')}] Updated Arena Embed}`);
			} catch (err) {
				console.error(`Other Error: ${err}`);
			}
		});
	}

	if (config.autoUpdate.arena.enabled == 'true') updateMap();

	setInterval(function () {
		if (config.autoUpdate.arena.enabled == 'true') {
			var date = new Date();

			if (date.getMinutes() % config.autoUpdate.arena.interval == 0) {
				updateMap();
			}
		}
	}, Math.max(1, 1 || 1) * 60 * 1000);
});
