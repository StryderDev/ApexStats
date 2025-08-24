const axios = require('axios');
const chalk = require('chalk');
const { emoteFile, nextMapLength } = require('../../utilities/misc.js');
const { MessageFlags, ContainerBuilder, SlashCommandBuilder } = require('discord.js');

const emotes = require(`../../data/${emoteFile(process.env.DEBUG)}Emotes.json`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wildcard')
		.setDescription('View current and future Wildcard map rotations')
		.addNumberOption(option => option.setName('next').setDescription('Amount of future map rotations').setMinValue(1).setMaxValue(10).setRequired(false)),

	async execute(interaction) {
		const amount = interaction.options.getNumber('next');
		const nextAmount = amount == null ? 1 : amount;

		const loadingContainer = new ContainerBuilder().addTextDisplayComponents(textDisplay => textDisplay.setContent(`${emotes.loading} Loading Wildcard map data...`));

		interaction.editReply({
			components: [loadingContainer],
			flags: MessageFlags.IsComponentsV2,
		});

		await axios
			.get(`https://solaris.apexstats.dev/beacon/map/wildcard?key=${process.env.SPYGLASS}&next=${nextAmount}`)
			.then(async res => {
				const map = res.data;
				const mapInfo = map.map;

				if (map.active == false) {
					const inactiveContainer = new ContainerBuilder().addTextDisplayComponents(textDisplay =>
						textDisplay.setContent(`# Wildcard Rotation Disabled\n${emotes.listArrow} There is no active Wildcard map in rotation`),
					);

					return interaction.editReply({
						components: [inactiveContainer],
						flags: MessageFlags.IsComponentsV2,
					});
				}

				const mapImage = mapInfo.name.replace(/ /g, '').replace(/'/g, ''); // Remove spaces and single quotes from name for image URL
				const mapNextString = map.next[0] ? `\n${emotes.listArrow} Up Next: **${map.next[0].map.name} ${map.next[0].map.type}** for ${nextMapLength(map.next[0].duration)}` : ``;

				if (nextAmount === 1) {
					const singleMapContainer = new ContainerBuilder()
						.addTextDisplayComponents(textDisplay =>
							textDisplay.setContent(
								`# ${emotes.online} ${mapInfo.name} ${mapInfo.type}\n${emotes.listArrow} **${mapInfo.name} ${mapInfo.type}** ends <t:${map.times.nextMap}:R> at <t:${map.times.nextMap}:t> ${mapNextString}`,
							),
						)
						.addMediaGalleryComponents(mediaGallery =>
							mediaGallery.addItems(mediaGalleryItem =>
								mediaGalleryItem.setDescription('Map Image for the Wildcard Mode').setURL(`https://specter.apexstats.dev/ApexStats/Maps/${mapImage}_Wildcard.png?key=${process.env.SPECTER}`),
							),
						);

					return interaction.editReply({
						components: [singleMapContainer],
						flags: MessageFlags.IsComponentsV2,
					});
				}

				const nextMaps = map.next.slice(0, nextAmount);

				let nextMapString = '';

				for (let i = 0; i < nextMaps.length; i++) {
					nextMapString += `${emotes.listArrow} **${nextMaps[i].map.name} ${nextMaps[i].map.type}**\n${emotes.listArrow} Starts at <t:${nextMaps[i].start}:t> and lasts ${nextMapLength(
						nextMaps[i].duration,
					)}\n\n`;
				}

				const nextMapContainer = new ContainerBuilder().addTextDisplayComponents(textDisplay => textDisplay.setContent(`# Upcoming Wildcard Maps\n${nextMapString}`));

				return interaction.editReply({
					components: [nextMapContainer],
					flags: MessageFlags.IsComponentsV2,
				});
			})
			.catch(err => {
				console.error(chalk.red(`${chalk.bold('[MAP]')} Axios error: ${err}`));

				const errorContainer = new ContainerBuilder().addTextDisplayComponents(textDisplay => textDisplay.setContent(`${emotes.listArrow} An error occurred while fetching map data. Please try again later.`));

				return interaction.editReply({
					components: [errorContainer],
					flags: MessageFlags.IsComponentsV2,
				});
			});
	},
};
