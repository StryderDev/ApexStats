const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { nextMapLength } = require('../../utilities/map.js');
const { embedColor, Misc } = require('../../data/utilities.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ltm')
		.setDescription('Shows the current and next LTM map rotation.')
		.addNumberOption(option => option.setName('next').setDescription('Select the number of future map rotations you want to see').setMaxValue(1).setMaxValue(10).setRequired(false)),

	async execute(interaction) {
		// Slash Command Options
		const nextOption = interaction.options.getNumber('next');

		// If the user doesn't specify a number, default to 1
		const nextMapCount = nextOption == null ? 1 : nextOption;

		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Grabbing map data from API...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await axios
			.get(`https://solaris.apexstats.dev/beacon/map/ltm?key=${process.env.SPYGLASS}&next=${nextMapCount}`)
			.then(async response => {
				const map = response.data;
				const active = map.active;

				if (active === false) {
					const mapEmbed = new EmbedBuilder().setTitle('No Active Map').setDescription('There is currently no active map rotation.').setColor(embedColor);

					interaction.editReply({ embeds: [mapEmbed] });
				} else if (nextMapCount === 1) {
					const mapImage = map.map.name.replace(/ /g, '').replace(/'/g, '');

					const mapEmbed = new EmbedBuilder()
						.setTitle(`Current LTM: ${map.map.type} - ${map.map.name}`)
						.setDescription(
							`**${map.map.type} - ${map.map.name}** ends <t:${map.times.nextMap}:R> at <t:${map.times.nextMap}:t>.\n**Up Next:** ${map.next[0].map.type} - ${map.next[0].map.name} for 15 minutes.`,
						)
						.setImage(`https://specter.apexstats.dev/ApexStats/Maps/${mapImage}.png?t=${Math.floor(Math.random() * 10) + 1}&key=${process.env.SPECTER}`)
						.setColor(embedColor);

					interaction.editReply({ embeds: [mapEmbed] });
				} else {
					// use the map.next to get the next nextMapCount maps
					const nextMaps = map.next.slice(0, nextMapCount);
					const mapImage = map.map.name.replace(/ /g, '').replace(/'/g, '');

					let nextMapString = '';

					for (let i = 0; i < nextMaps.length; i++) {
						nextMapString += `**${nextMaps[i].map.type} - ${nextMaps[i].map.name}**\nStarts at <t:${nextMaps[i].start}:t> for ${nextMapLength(nextMaps[i].duration.minutes, nextMaps[i].duration.hours)}\n\n`;
					}

					const mapEmbed = new EmbedBuilder()
						.setTitle(`Next ${nextMapCount} Mixtape Map Rotations`)
						.setDescription(`**Currently:** ${map.map.type} - ${map.map.name}\nEnds <t:${map.times.nextMap}:R> at <t:${map.times.nextMap}:t>.\n\n**Up Next:**\n${nextMapString}`)
						.setColor(embedColor);

					interaction.editReply({ embeds: [mapEmbed] });
				}
			})
			.catch(error => {
				if (error.response) {
					console.log(error.response.data);

					const errorEmbed = new EmbedBuilder().setTitle('Map Lookup Error').setDescription(error.response.data.error).setColor('D0342C').setTimestamp();

					interaction.editReply({ embeds: [errorEmbed] });
				} else if (error.request) {
					console.log(error.request);

					const errorEmbed = new EmbedBuilder()
						.setTitle('Site Lookup Error')
						.setDescription(`The request was not returned successfully.\nThis is potentially an error with the API.\nPlease try again shortly.`)
						.setColor('D0342C')
						.setTimestamp();

					interaction.editReply({ embeds: [errorEmbed] });
				} else {
					console.log(error.message);

					const errorEmbed = new EmbedBuilder().setTitle('Unknown Error').setDescription(`This should never happen.\nIf you see this error, please contact <@360564818123554836> ASAP.`).setColor('D0342C');

					interaction.editReply({ embeds: [errorEmbed] });
				}
			});
	},
};
