const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, SlashCommandBuilder } = require('discord.js');

const { Season } = require('../../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder().setName('season').setDescription('Shows info about a selected season.'),
	async execute(interaction) {
		const loading = new EmbedBuilder().setDescription(`Select a season from the dropdown list.`).setColor('2F3136');

		const seasonList = new ActionRowBuilder().addComponents(
			new SelectMenuBuilder()
				.setCustomId('seasonInfo')
				.setPlaceholder('Select a Season')
				.setMinValues(1)
				.setMaxValues(1)
				.addOptions([
					{ label: 'Season 15 - Eclipse', value: '15', emoji: Season['Season_15'] },
					{ label: 'Season 14 - Hunted', value: '14', emoji: Season['Season_14'] },
					{ label: 'Season 13 - Saviors', value: '13', emoji: Season['Season_13'] },
					{ label: 'Season 12 - Defiance', value: '12', emoji: Season['Season_12'] },
					{ label: 'Season 11 - Escape', value: '11', emoji: Season['Season_11'] },
					{ label: 'Season 10 - Emergence', value: '10', emoji: Season['Season_10'] },
					{ label: 'Season 9 - Legacy', value: '9', emoji: Season['Season_9'] },
					{ label: 'Season 8 - Mayhem', value: '8', emoji: Season['Season_8'] },
					{ label: 'Season 7 - Ascension', value: '7', emoji: Season['Season_7'] },
					{ label: 'Season 6 - Boosted', value: '6', emoji: Season['Season_6'] },
					{ label: "Season 5 - Fortune's Favor", value: '5', emoji: Season['Season_5'] },
					{ label: 'Season 4 - Assimilation', value: '4', emoji: Season['Season_4'] },
					{ label: 'Season 3 - Meltdown', value: '3', emoji: Season['Season_3'] },
					{ label: 'Season 2 - Battle Charge', value: '2', emoji: Season['Season_2'] },
					{ label: 'Season 1 - The Wild Frontier', value: '1', emoji: Season['Season_1'] },
					{ label: 'Season 0 - PreSeason', value: '0', emoji: Season['Season_0'] },
				]),
		);

		await interaction.editReply({ embeds: [loading], components: [seasonList] });
	},
};
