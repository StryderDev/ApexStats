const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

const { api } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder().setName('arenas').setDescription('Shows the current in-game arena.'),
	async execute(interaction) {
		const loadingEmbed = new MessageEmbed().setDescription(
			`<a:ApexBot_Loading:940037271980220416> Loading current in-game arena...`,
		);

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

		function mapName(name) {
			if (name == 'Phase runner') return 'Phase Runner';

			return name;
		}

		await axios
			.get(`https://api.mozambiquehe.re/maprotation?version=5&auth=${api.apex}`)
			.then(response => {
				const arena = response.data.arenas;
				const arenaRanked = response.data.arenasRanked;

				const mapEmbed = new MessageEmbed()
					.setTitle(`Legends are currently competing in **${mapName(arena.current.map)}**.`)
					.setDescription(
						`${mapName(arena.current.map)} Arena ends <t:${arena.current.end}:R>, or at <t:${
							arena.current.end
						}:t>.\n**Next up:** ${mapName(arena.next.map)} for ${mapLength(
							arena.next.DurationInMinutes,
						)}.\n**Ranked Arena**: ${mapName(arenaRanked.current.map)}`,
					)
					.setImage(
						`https://cdn.apexstats.dev/Bot/Maps/Season12/Arenas/${encodeURIComponent(
							mapName(arena.current.map),
						)}.png`,
					);

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
