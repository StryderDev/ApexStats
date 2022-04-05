const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const wait = require('util').promisify(setTimeout);

const guns = require('../data/guns.json');
const { Misc } = require('../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder().setName('loadout').setDescription('Picks a random loadout to use in-game.'),
	async execute(interaction) {
		await interaction.editReply({ content: `${Misc.Loading} Choosing a random loadout to use...` });
		await wait(1000);

		const gunOne = Math.floor(Math.random() * guns.length);
		const gunOneText = guns[gunOne];

		const gunTwo = Math.floor(Math.random() * guns.length);
		const gunTwoText = guns[gunTwo];

		await interaction.editReply({ content: `Use the **${gunOneText}** and the **${gunTwoText}** this round.` });
	},
};
