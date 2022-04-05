const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

const { Misc } = require('../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder().setName('map').setDescription('Shows the current in-game map.'),
	async execute(interaction) {
		const loadingEmbed = new MessageEmbed().setDescription(`${Misc.Loading} Loading current in-game map...`);

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
				const br = response.data.br;
				const brRanked = br.ranked;

				const mapEmbed = new MessageEmbed()
					.setTitle(`Legends are currently dropping into **${br.map}**.`)
					.setDescription(
						`${br.map} Arena ends <t:${br.times.next}:R>, or at <t:${br.times.next}:t>.\n**Next up:** ${br.next[0].map} for ${mapLength(
							br.next[0].duration,
						)}.\n**Ranked Arena**: ${brRanked.map}`,
					)
					.setImage(`https://cdn.apexstats.dev/Bot/Maps/Season12/BR/${encodeURIComponent(br.map)}.png?q=${Math.floor(Math.random() * 10)}`);

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
