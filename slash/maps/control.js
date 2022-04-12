const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

const { api } = require('../../config.json');
const { Misc } = require('../../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder().setName('control').setDescription('Shows the current in-game control map.'),
	async execute(interaction) {
		// const text = `The **Control LTM** is not currently active, but is set to return on <t:1648573200:F>, or <t:1648573200:R>.`;

		// await interaction.editReply({ content: text });

		const loadingEmbed = new MessageEmbed().setDescription(`${Misc.Loading} Loading current in-game Control map...`);

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
			.get(`https://api.mozambiquehe.re/maprotation?version=5&auth=${api.apex}`)
			.then(response => {
				const control = response.data.control;

				const mapEmbed = new MessageEmbed()
					.setTitle(`Legends are currently Taking Control in **${control.current.map}**.`)
					.setDescription(
						`${control.current.map} ends <t:${control.current.end}:R>, or at <t:${control.current.end}:t>.\n**Next up:** ${control.next.map} for ${mapLength(
							control.next.DurationInMinutes,
						)}.`,
					)
					.setImage(`https://cdn.apexstats.dev/Bot/Maps/Season12/Control/${encodeURIComponent(control.current.map)}.png`);

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
