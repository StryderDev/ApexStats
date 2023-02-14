const wait = require('util').promisify(setTimeout);
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const guns = require('../../data/guns.json');
const { embedColor, Emotes } = require('../../data/utilities.json');

module.exports = {
	data: new SlashCommandBuilder().setName('loadout').setDescription('Select a random gun loadout from the available in-game guns.'),

	async execute(interaction) {
		const loadingEmbed = new EmbedBuilder().setDescription(`${Emotes.Misc.Loading} Selecting a random loadout...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await wait(1000);

		const firstGun = Math.floor(Math.random() * guns.length);
		const secondGun = Math.floor(Math.random() * guns.length);

		const firstText = guns[firstGun];
		const secondText = guns[secondGun];

		await interaction.editReply({ content: `Use the **${firstText}** and the **${secondText}** this round.`, embeds: [] });
	},
};
