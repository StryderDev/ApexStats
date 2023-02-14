const wait = require('util').promisify(setTimeout);
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { embedColor, Emotes } = require('../../data/utilities.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('who')
		.setDescription('Select a random legend to play.')
		.addStringOption(option =>
			option
				.setName('type')
				.setDescription('Class of legend to choose from.')
				.setRequired(false)
				.addChoices(
					{ name: 'Assault', value: 'assault' },
					{ name: 'Skirmisher', value: 'skirmisher' },
					{ name: 'Recon', value: 'recon' },
					{ name: 'Support', value: 'support' },
					{ name: 'Controller', value: 'controller' },
				),
		),

	async execute(interaction) {
		// Slash Command Options
		const type = interaction.options.getString('type');

		const loadingEmbed = new EmbedBuilder().setDescription(`${Emotes.Misc.Loading} Selecting a random loadout...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await wait(1000);

		if (!type) {
			legendFile = require('../../data/legends/all.json');
		} else {
			legendFile = require(`../../data/legends/${type}.json`);
		}

		const legend = Math.floor(Math.random() * legendFile.length);

		const legendEmbed = new EmbedBuilder()
			.setDescription(`Play **${legendFile[legend]}** this round!`)
			.setImage(`https://cdn.jumpmaster.xyz/Bot/Legends/Banners/${encodeURIComponent(legendFile[legend])}.png`)
			.setColor(embedColor);

		await interaction.editReply({ embeds: [legendEmbed] });
	},
};
