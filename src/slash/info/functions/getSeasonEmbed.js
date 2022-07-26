const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

async function getSeasonEmbed(season) {
	const response = await axios.get(`https://api.jumpmaster.xyz/misc/Seasons?season=${season}`);
	const data = response.data;

	// TODO
	// Fix the image background to be transparent instead of normal discord gray
	// Add custom colours to DB for each season

	const embed = new EmbedBuilder()
		.setTitle(`Season ${data.info.ID} - ${data.info.Name}`)
		.setURL(data.misc.Link)
		.addFields([
			{ name: 'Featured Legend', value: data.new.Legend, inline: true },
			{ name: 'Featured Weapon', value: data.new.Weapon, inline: true },
			{ name: 'Featured Map', value: data.new.Map, inline: true },
			{ name: 'Start Date', value: `<t:${data.dates.Start}>`, inline: true },
			{ name: 'End Date', value: `<t:${data.dates.End}>`, inline: true },
		])
		.setImage(`https://cdn.jumpmaster.xyz/Bot/Maps/SeasonMaps/Season%20${data.info.ID}.png`)
		.setColor(data.misc.Color)
		.setFooter({ text: data.info.Tagline });

	return embed;
}

module.exports = { getSeasonEmbed };
