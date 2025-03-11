const axios = require('axios');
const chalk = require('chalk');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { emoteFile, nextMapLength } = require('../../utilities/misc.js');

const emotes = require(`../../data/${emoteFile(process.env.DEBUG)}Emotes.json`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ranked')
		.setDescription('View current and future Ranked map rotations')
		.addNumberOption(option => option.setName('next').setDescription('Amount of future map rotations').setMinValue(1).setMaxValue(10).setRequired(false)),

	async execute(interaction) {
		const amount = interaction.options.getNumber('next');
		const nextAmount = amount == null ? 1 : amount;

		const loadingEmbed = new EmbedBuilder().setDescription(`${emotes.loading} Loading Ranked map data...`);
		await interaction.editReply({ embeds: [loadingEmbed] });

		const rankedAPI = axios.get(`https://solaris.apexstats.dev/beacon/map/ranked?key=${process.env.SPYGLASS}&next=${nextAmount}`);
		const seasonAPI = axios.get('https://api.jumpmaster.xyz/seasons/Current?version=2');

		await axios
			.all([rankedAPI, seasonAPI])
			.then(
				axios.spread((...res) => {
					const map = res[0].data;
					const ranked = res[1].data.dates;

					const mapInfo = map.map;
					const split = ranked.split.timestamp;
					const end = ranked.end.rankedEnd;

					if (map.active == false) {
						const mapEmbed = new EmbedBuilder().setTitle(`${emotes.offline} No Active Map`).setDescription(`${emotes.listArrow} There is no active Ranked map in rotation.`);

						interaction.editReply({ embeds: [mapEmbed] });
					} else if (nextAmount === 1) {
						const mapImage = mapInfo.name.replace(/ /g, '').replace(/'/g, ''); // Remove spaces and single quotes from name for image URL

						const mapEmbed = new EmbedBuilder()
							.setTitle(`${emotes.online} ${mapInfo.type} - ${mapInfo.name}`)
							.setDescription(
								`${emotes.listArrow} **${mapInfo.name}** ends <t:${map.times.nextMap}:R> at <t:${map.times.nextMap}:t>\n${emotes.listArrow} Up Next: **${map.next[0].map.name}** for ${nextMapLength(
									map.next[0].duration,
								)}`,
							)
							.addFields([
								{ name: ':calendar: Ranked Split', value: `${emotes.listArrow} <t:${split - 1800}:D>\n${emotes.listArrow} <t:${split - 1800}:t>`, inline: true },
								{ name: ':calendar: Ranked End', value: `${emotes.listArrow} <t:${end}:D>\n${emotes.listArrow} <t:${end}:t>`, inline: true },
							])
							.setImage(`https://specter.apexstats.dev/ApexStats/Maps/${mapImage}.png?key=${process.env.SPECTER}`)
							.setFooter({ text: 'Times are automatically converted to your local time\nRanked ends 30 minutes before split & season end' });

						interaction.editReply({ embeds: [mapEmbed] });
					} else {
						const nextMaps = map.next.slice(0, nextAmount);

						let nextMapString = '';

						for (let i = 0; i < nextMaps.length; i++) {
							nextMapString += `${emotes.listArrow} **${nextMaps[i].map.name}**\n${emotes.listArrow} Starts at <t:${nextMaps[i].start}:t> and lasts ${nextMapLength(nextMaps[i].duration)}\n\n`;
						}

						const mapEmbed = new EmbedBuilder()
							.setTitle(`${emotes.online} ${nextAmount} Next ${mapInfo.type} Map Rotations`)
							.setDescription(`${emotes.listArrow} Currently: **${mapInfo.name}** for ${nextMapLength(map.times.remaining)}\n\n${nextMapString}`)
							.setFooter({ text: 'Times are automatically converted to your local time' });

						interaction.editReply({ embeds: [mapEmbed] });
					}
				}),
			)
			.catch(err => {
				console.error(chalk.red(`${chalk.bold('[MAP]')} Axios error: ${err}`));

				const errorEmbed = new EmbedBuilder().setDescription(`${emotes.listArrow} An error occurred while fetching map data. Please try again later.`);

				interaction.editReply({ embeds: [errorEmbed] });
			});
	},
};
