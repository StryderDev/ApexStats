const { isPlural, emoteFile } = require('../../utilities/misc.js');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { version } = require('../../../package.json');
const emotes = require(`../../data/${emoteFile(process.env.DEBUG)}Emotes.json`);

module.exports = {
	data: new SlashCommandBuilder().setName('map').setDescription('View current and future Battle Royale map rotations'),

	async execute(interaction) {
		console.log('Hi');
	},
};
