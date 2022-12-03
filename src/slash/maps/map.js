const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { api } = require('../../config.json');
const { Misc } = require('../../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder().setName('map').setDescription('Shows the current in-game map.'),
	async execute(interaction) {
		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Loading current in-game map...`).setColor('2F3136');
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

		function futureLength(amount) {
			if (!amount) return '1';

			return amount;
		}

		await axios
			.get(`https://api.mozambiquehe.re/maprotation?auth=${api.apex}&version=2`)
			.then(response => {
				const br = response.data.battle_royale;
				const ranked = response.data.ranked;
				const mapEmbed = new EmbedBuilder()
					.setTitle(`Legends are currently dropping into **${br.current.map}**.`)
					.setDescription(
						`${br.current.map} ends <t:${br.current.end}:R>, or at <t:${br.current.end}:t>.\n**Next Up:** ${br.next.map} for ${mapLength(
							br.next.DurationInMinutes,
						)}.\n**Ranked**: Kings Canyon. Ends <t:1664298000:R>.`,
					)
					.setColor('2F3136')
					.setImage(`https://cdn.jumpmaster.xyz/Bot/Maps/Season%2014/Battle%20Royale/${encodeURIComponent(br.current.map)}.png`);

                axios.get(`https://api.jumpmaster.xyz/logs/MapBR?dev=${debug.true}`);

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
