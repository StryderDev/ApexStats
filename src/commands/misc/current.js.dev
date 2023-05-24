const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { Misc, embedColor } = require('../../data/utilities.json');

module.exports = {
	data: new SlashCommandBuilder().setName('current').setDescription('Information about the current season.'),

	async execute(interaction) {
		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Loading current season data...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await axios.get('https://api.jumpmaster.xyz/seasons/Current?version=2').then(response => {
			const season = response.data;

			const currentSeason = new EmbedBuilder().setTitle(`Apex Legends: ${season.info.title}`).setColor(embedColor);

			interaction.editReply({ embeds: [currentSeason] });
		});
	},
};
