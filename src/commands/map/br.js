const axios = require('axios');
const { emoteFile } = require('../../utilities/misc.js');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const emotes = require(`../../data/${emoteFile(process.env.DEBUG)}Emotes.json`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('map')
		.setDescription('View current and future Battle Royale map rotations')
		.addNumberOption(option => option.setName('next').setDescription('Amount of future map rotations').setMinValue(1).setMaxValue(10).setRequired(false)),

	async execute(interaction) {
		const amount = interaction.options.getNumber('next');
		const nextAmount = amount == null ? 1 : amount;

		const loadingEmbed = new EmbedBuilder().setDescription(`${emotes.loading} Loading Battle Royale map data...`);
		await interaction.editReply({ embeds: [loadingEmbed] });

		await axios.get(`https://solaris.apexstats.dev/beacon/map/br?key=${process.env.SPYGLASS}&next=${nextAmount}`).then(async resp => {
			const map = resp.data;

			if (map.active == false) {
				const mapEmbed = new EmbedBuilder().setTitle(`${emotes.offline} No Active Map`).setDescription(`${emotes.listArrow} There is no active Battle Royale map in rotation.`);

				interaction.editReply({ embeds: [mapEmbed] });
			} else if (nextAmount === 1) {
				// Remove spaces and single quotes from the map
				// name so it can be used in the specter URL
				const mapImage = map.map.replace(/ /g, '').replace(/'/g, '');

				const mapEmbed = new EmbedBuilder().setTitle(`${emotes.online} Battle Royale: ${map.map}`);

				interaction.editReply({ embeds: [mapEmbed] });
			}
		});
	},
};
