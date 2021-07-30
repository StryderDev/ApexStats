const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'invite',
	description: 'Show bot invite.',

	run: async (client, interaction) => {
		interaction.followUp({
			content: 'Invite the bot to your own server using this link: <https://apexstats.dev/invite>',
		});
	},
};
