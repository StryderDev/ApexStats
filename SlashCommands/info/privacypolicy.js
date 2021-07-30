const { CommandInteraction, MessageEmbed } = require('discord.js');
const axios = require('axios');
const { DateTime, Duration } = require('luxon');

module.exports = {
	name: 'privacypolicy',
	description: 'Show bot privacy policy.',

	run: async (client, interaction) => {
		interaction.followUp({
			content: 'View our privacy policy: <https://apexstats.dev/privacypolicy>',
		});
	},
};
