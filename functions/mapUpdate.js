const client = require('../Apex.js');
const { rotations } = require('../config.json');
const chalk = require('chalk');
const { DateTime } = require('luxon');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

async function updateMap() {
	const response = await axios.get('https://fn.alphaleagues.com/v2/apex/map/?next=1');

	function mapImageName(name) {
		if (name == 'Kings Canyon') return 'KingsCanyon';
		if (name == "World's Edge") return 'WorldsEdge';

		return name;
	}

	try {
		const map = new MessageEmbed()
			.setDescription(
				`The current map is **${response.data.br.map}** and ends <t:${response.data.br.times.next}:R>.\nThe next map is **${response.data.br.next[0].map}** for ${response.data.br.next[0].duration} minutes.\nThe current ranked map is **${response.data.br.ranked.map}** and ends <t:${response.data.br.ranked.end}:R>.`,
			)
			.setImage(
				`https://cdn.apexstats.dev/Maps/Season%2010/BR/${mapImageName(response.data.br.map)}_00${
					response.data.br.ranked.split
				}.gif`,
			)
			.setFooter('Provided by https://rexx.live/')
			.setTimestamp();

		const guild = client.guilds.cache.get(rotations.guild);
		// if (!guild) return console.log(chalk`{gray Unable to find guild for Map Updates.}`);
		if (!guild) return;

		const channel = guild.channels.cache.find(c => c.id === rotations.map.channel && c.type === 'GUILD_TEXT');
		// if (!channel) return console.log('Unable to find channel.');
		if (!channel) return;

		try {
			const message = channel.messages.fetch(rotations.map.message);
			if (!message) return console.log('Unable to find message.');

			channel.messages.fetch(rotations.map.message).then(msg => {
				msg.edit({ embeds: [map] });
			});

			console.log(chalk`{blue.bold [${DateTime.local().toFormat('hh:mm:ss')}] Updated Map Embed}`);
		} catch (err) {
			console.error(`Other Error: ${err}`);
		}
	} catch (error) {
		console.error(chalk`{red.bold [${timeLogs}] Error: ${error.code} on Map API in Map Update.}`);
	}
}

module.exports = { updateMap };
