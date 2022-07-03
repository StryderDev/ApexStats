const { MessageEmbed } = require('discord.js');
const axios = require('axios');

async function getSeasonEmbed(season) {
	const response = await axios.get(`https://api.apexstats.dev/seasonData?season=${season}`);
	const data = response.data;

	const embed = new MessageEmbed()
		.setTitle(`Season ${data.info.number} - ${data.info.name}`)
		.addField(`Featured Legend`, data.new.legend, true)
		.addField(`Featured Weapon`, data.new.gun, true)
		.addField(`Featured Map`, data.new.map, true);

	return embed;
}

module.exports = { getSeasonEmbed };
