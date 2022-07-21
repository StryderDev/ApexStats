const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const wait = require('util').promisify(setTimeout);

const { Misc } = require('../../data/emotes.json');
const facts = require('../../data/funfacts.json');

module.exports = {
	data: new SlashCommandBuilder().setName('funfacts').setDescription('Replies with a random apex-related fun-fact.'),

	async execute(interaction) {
		const loading = new MessageEmbed().setDescription(`${Misc.Loading} Loading a random fact...`);

		const fact = Math.floor(Math.random() * facts.length);
		const factText = facts[fact];

		await interaction.editReply({ embeds: [loading] });
		await wait(1000);
		await interaction.editReply({ content: factText, embeds: [] });
	},
};
