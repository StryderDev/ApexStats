const wait = require('util').promisify(setTimeout);
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { embedColor, Emotes } = require('../../data/utilities.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('drop')
		.setDescription('Select a random drop location from the current map, or select a specific map to choose from.')
		.addStringOption(option =>
			option
				.setName('map')
				.setDescription('Manually pick a map')
				.setRequired(false)
				.addChoices(
					{ name: 'Kings Canyon', value: 'Kings Canyon' },
					{ name: "World's Edge", value: "World's Edge" },
					{ name: 'Olympus', value: 'Olympus' },
					{ name: 'Storm Point', value: 'Storm Point' },
					{ name: 'Broken Moon', value: 'Broken Moon' },
				),
		),

	async execute(interaction) {
		// Slash Command Options
		const mapOption = interaction.options.getString('map');

		const loadingEmbed = new EmbedBuilder().setDescription(`${Emotes.Misc.Loading} Selecting a random place to drop...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await wait(1000);

		if (mapOption != null) {
			const map = `../../data/drops/Season 16/${mapOption}.json`;
		}
	},
};
