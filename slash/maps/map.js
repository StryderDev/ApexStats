const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

const { Misc } = require('../../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('map')
		.setDescription('Shows the current in-game map.')
		.addIntegerOption(option =>
			option.setName('future').setDescription('Amount of future map rotations you would like to see.').setRequired(false).setMinValue(1).setMaxValue(10),
		),
	async execute(interaction) {
		const loadingEmbed = new MessageEmbed().setDescription(`${Misc.Loading} Loading current in-game map...`).setColor('2F3136');
		const future = interaction.options.getInteger('future');

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
			.get(`https://fn.alphaleagues.com/v2/apex/map/?next=${futureLength(future)}`)
			.then(response => {
				const br = response.data.br;
				const brRanked = br.ranked;

				function nextMaps() {
					return br.next.map(x => `**${x.map}**\nStarts <t:${x.timestamp}:R> and lasts for **${mapLength(x.duration)}**.\n\n`).join('');
				}

				const mapEmbed = new MessageEmbed()
					.setTitle(`Legends are currently dropping into **${br.map}**.`)
					.setDescription(
						`${br.map} Arena ends <t:${br.times.next}:R>, or at <t:${br.times.next}:t>.\n**Next up:** ${br.next[0].map} for ${mapLength(
							br.next[0].duration,
						)}.\n**Ranked Arena**: ${brRanked.map}`,
					)
					.setColor('2F3136')
					.setImage(`https://cdn.apexstats.dev/Bot/Maps/Season12/BR/${encodeURIComponent(br.map)}.png?q=${Math.floor(Math.random() * 10)}`);

				const futureEmbed = new MessageEmbed().setTitle('Future Map Rotation Schedule').setDescription(`\u200b${nextMaps()}`).setColor('2F3136');

				if (futureLength(future) == '1') {
					interaction.editReply({ embeds: [mapEmbed] });
				} else {
					interaction.editReply({ embeds: [futureEmbed] });
				}
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
