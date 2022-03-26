const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

const { api } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder().setName('control').setDescription('Shows the current in-game control map.'),
	async execute(interaction) {
		const text = `The **Control LTM** is not currently active, but is set to return on <t:1648573200:F>, or <t:1648573200:R>.`;

		await interaction.editReply({ content: text });
	},
};
