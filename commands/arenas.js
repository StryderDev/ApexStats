const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

const { Misc } = require('../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder().setName('arenas').setDescription('Shows the current in-game arena.'),
	async execute(interaction) {
		const loadingEmbed = new MessageEmbed().setDescription(`${Misc.Loading} Loading current in-game arena...`);

		await interaction.editReply({ embeds: [loadingEmbed] });

		function isPlural(number, word) {
			if (number != 1) return `${word}s`;

			return word;
		}

		function mapLength(minutes) {
			if (minutes >= 60) {
				const hrs = Math.floor(minutes / 60);
				const mins = minutes % 60;

				return `${hrs} ${isPlural(hrs, 'hour')}, ${mins} ${isPlural(mins, 'minute')}`;
			} else {
				return `${minutes} ${isPlural(minutes, 'minute')}`;
			}
		}

		await axios
			.get(`https://fn.alphaleagues.com/v2/apex/map/?next=1`)
			.then(response => {
				const arenas = response.data.arenas;
				const arenasRanked = arenas.ranked;

				const mapEmbed = new MessageEmbed()
					.setTitle(`Legends are currently competing in **${arenas.map}**.`)
					.setDescription(
						`${arenas.map} Arena ends <t:${arenas.times.next}:R>, or at <t:${arenas.times.next}:t>.\n**Next up:** ${arenas.next[0].map} for ${mapLength(
							arenas.next[0].duration,
						)}.\n**Ranked Arena**: ${arenasRanked.map} for <t:${arenasRanked.times.next}:R>.`,
					)
					.setImage(`https://cdn.apexstats.dev/Bot/Maps/Season12/Arenas/${encodeURIComponent(arenas.map)}.png?q=${Math.floor(Math.random() * 10)}`);

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
