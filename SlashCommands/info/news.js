const { default: axios } = require('axios');
const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const { mozam } = require('../../config.json');

module.exports = {
	name: 'news',
	description: 'Shows the most recent news article from the Apex Legends blog.',

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		axios.get(`https://api.mozambiquehe.re/news?lang=en-us&auth=${mozam}`).then(result => {
			var data = result.data[0];

			const news = new MessageEmbed()
				.setTitle(data.title)
				.setDescription(`${data.short_desc}\n\n[Link to full article](${data.link})`)
				.setImage(data.img)
				.setFooter('Data provided by https://apexlegendsapi.com/');

			interaction.followUp({
				embeds: [news],
			});
		});
	},
};
