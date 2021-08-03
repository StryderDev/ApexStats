const { CommandInteraction, MessageEmbed } = require('discord.js');
const axios = require('axios');
const config = require('../../config.json');

module.exports = {
	name: 'news',
	description: 'Show the most recent news article from the official Apex Legends blog.',

	run: async (client, interaction) => {
		axios.get(`https://api.mozambiquehe.re/news?lang=en-us&auth=${config.api.Mozambique}`).then(result => {
			var news = result.data[0];

			const newsEmbed = new MessageEmbed()
				.setTitle(news.title)
				.setDescription(`${news.short_desc}\n\n[Link to full article](${news.link})`)
				.setImage(news.img)
				.setFooter('Data provided by https://apexlegendsapi.com/');

			interaction.followUp({ embeds: [newsEmbed] });
		});
	},
};
