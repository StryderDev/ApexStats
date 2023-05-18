const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { release } = require('../../config.json');
const { version } = require('../../../package.json');
const { embedColor } = require('../../data/utilities.json');

module.exports = {
	data: new SlashCommandBuilder().setName('current').setDescription('Information about the current season.'),

	async execute(interaction) {
		console.log('current');
	},
};
