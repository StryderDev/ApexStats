const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'commands',
	description: 'Commands available to the bot.',

	run: async (client, interaction) => {
		const embed = new MessageEmbed()
			.setTitle('Bot Commands')
			.addField('Fun', '/drop\n/who', true)
			.addField('Info.', '/invite\n/privacypolicy\n/commands', true)
			.addField('Utility', '/arenas\n/map\n/status', true);

		interaction.editReply({ embeds: [embed] });
	},
};
