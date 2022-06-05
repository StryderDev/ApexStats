const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

const { Misc } = require('../../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder().setName('arenas').setDescription('Shows the current in-game arena.'),
	//.addIntegerOption(option =>
	//	option.setName('future').setDescription('Amount of future arenas rotations you would like to see.').setRequired(false).setMinValue(1).setMaxValue(10),
	//),
	async execute(interaction) {
		const loadingEmbed = new MessageEmbed().setDescription(`${Misc.Loading} Loading current in-game arena...`).setColor('2F3136');
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
				const arenas = response.data.arenas;
				const arenasRanked = arenas.ranked;

				//function nextMaps() {
				//	return arenas.next.map(x => `**${x.map}**\nStarts <t:${x.timestamp}:R> and lasts for **${mapLength(x.duration)}**.\n\n`).join('');
				//}

				const mapEmbed = new MessageEmbed()
					.setTitle(`Legends are currently competing in **${arenas.map}**.`)
					.setDescription(
						`${arenas.map} Arena ends <t:${arenas.times.next}:R>, or at <t:${arenas.times.next}:t>.\n
                        `,
						//**Next up:** ${arenas.next[0].map} for ${mapLength(
						//	arenas.next[0].duration,
						//)}.\n**Ranked Arena**: ${arenasRanked.map} for <t:${arenasRanked.times.next}:R>.`,
					)
					.setImage(`https://cdn.apexstats.dev/Bot/Maps/Season13/Arenas/${encodeURIComponent(arenas.map)}.png?q=${Math.floor(Math.random() * 10)}`)
					.setColor('2F3136');

				//const futureEmbed = new MessageEmbed().setTitle('Future Arenas Rotation Schedule').setDescription(`\u200b${nextMaps()}`).setColor('2F3136');

				//if (futureLength(future) == '1') {
				interaction.editReply({ embeds: [mapEmbed] });
				//} else {
				//	interaction.editReply({ embeds: [futureEmbed] });
				//}
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
