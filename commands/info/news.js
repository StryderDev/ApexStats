const { default: axios } = require('axios');
const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const { mozam } = require('../../config.json');

module.exports = {
	name: 'news',
	/**
	 *
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		axios.get(`https://api.mozambiquehe.re/news?lang=en-us&auth=${mozam}`).then(result => {
			var data = result.data[0];

			const news = new MessageEmbed()
				.setTitle(data.title)
				.setDescription(`${data.short_desc}\n\n[Link to full article](${data.link})`)
				.setImage(data.img)
				.setFooter('Data provided by https://apexlegendsapi.com/');

			message.reply({
				embeds: [news],
			});
		});
	},
};
