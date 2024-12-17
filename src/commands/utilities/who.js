const wait = require('util').promisify(setTimeout);
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { embedColor, Misc } = require('../../data/utilities.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('who')
		.setDescription('Select a random legend to play.')
		.addStringOption(option =>
			option
				.setName('class')
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

		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Selecting a random legend...`);

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
			.setImage(`https://specter.apexstats.dev/ApexStats/Legends/${encodeURIComponent(legendFile[legend])}.png?t=${Math.floor(Math.random() * 10) + 1}&key=${process.env.SPECTER}`);
		await interaction.editReply({ embeds: [legendEmbed] });
	},
};
