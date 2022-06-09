const { SlashCommandBuilder } = require('@discordjs/builders');
const { default: axios } = require('axios');
const { MessageEmbed } = require('discord.js');

const { Misc } = require('../../data/emotes.json');
const { api } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder().setName('arenas').setDescription('Shows the current in-game arena map.'),

	async execute(interaction) {
		const loading = new MessageEmbed().setDescription(`${Misc.Loading} Loading in-game arena map rotation...`);

		await interaction.editReply({ embeds: [loading] });

		function checkMapName(name) {
			if (name == 'Party crasher') return 'Party Crasher';

			return name;
		}

		await axios
			.get(`https://api.mozambiquehe.re/maprotation?auth=${api.apex}&version=2`)
			.then(response => {
				const arenas = response.data.arenas;

				const mapEmbed = new MessageEmbed()
					.setTitle(`Legends are currently competing in ${checkMapName(arenas.current.map)}.`)
					.setDescription(
						`${checkMapName(arenas.current.map)} Arena ends <t:${arenas.current.end}:R>, or at <t:${arenas.current.end}:t>.\n**Next Up:** ${checkMapName(
							arenas.next.map,
						)} for ${arenas.next.DurationInMinutes} minutes.`,
					)
					.setImage(`https://cdn.apexstats.dev/Bot/Maps/Season13/Arenas/${encodeURIComponent(checkMapName(arenas.current.map))}.png?q=${Math.floor(Math.random() * 10)}`)
					.setColor('2F3136');

				interaction.editReply({ embeds: [mapEmbed] });
			})
			.catch(error => {
				// Request failed with a response outside of the 2xx range
				if (error.response) {
					console.log(error.response.data);
					// console.log(error.response.status);
					// console.log(error.response.headers);

					interaction.editReply({ content: `**Error**\n\`${error.response.data.error}\``, embeds: [] });
				} else if (error.request) {
					console.log(error.request);
					interaction.editReply({
						content: `**Error**\n\`The request was not returned successfully.\``,
						embeds: [],
					});
				} else {
					console.log(error.message);
					interaction.editReply({
						content: `**Error**\n\`Unknown. Try again or tell SDCore#0001.\``,
						embeds: [],
					});
				}
			});
	},
};
