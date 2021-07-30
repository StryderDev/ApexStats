const { CommandInteraction, MessageEmbed } = require('discord.js');
const axios = require('axios');
const { DateTime, Duration } = require('luxon');

module.exports = {
	name: 'invite',
	description: 'Show bot invite.',

	run: async (client, interaction) => {
		interaction.followUp({
			content: 'Invite the bot to your own server using this link: <https://apexstats.dev/invite>',
		});
	},
};
