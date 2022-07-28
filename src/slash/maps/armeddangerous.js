const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { api } = require('../../config.json');
const { Misc } = require('../../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder().setName('armed-and-dangerous').setDescription('Shows the current in-game Armed & Dangerous map.'),
	async execute(interaction) {
		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Loading current in-game Armed & Dangerous map...`).setColor('2F3136');

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
				const ltm = response.data.ltm;

				const mapEmbed = new EmbedBuilder()
					.setTitle(`Legends are currently Armed & Dangerous in **${ltm.current.map}**.`)
					.setDescription(
						`${ltm.current.map} ends <t:${ltm.current.end}:R>, or at <t:${ltm.current.end}:t>.\n**Next up:** ${ltm.next.map} for ${mapLength(
							ltm.next.DurationInMinutes,
						)}.`,
					)
					.setColor('2F3136')
					.setImage(`https://cdn.jumpmaster.xyz/Bot/Maps/Season%2013/Armed%20And%20Dangerous/${encodeURIComponent(ltm.current.map)}.png`);

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