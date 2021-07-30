const { CommandInteraction, MessageEmbed } = require('discord.js');

require('dotenv').config();

module.exports = {
	name: 'killhelp',
	description: 'Shows info about how kills are counted in the stats command.',

	run: async (client, interaction) => {
		const killEmbed = new MessageEmbed()
			.setTitle('Kill Logging')
			.setDescription(
				'We\'re only able to record kills from a certain legend if you have the "Kills" or "Arena Kills" tracker enabled on a legend.\n\nIn order to calculate your total kills, equip one of the two (or both!) trackers and run the command on each legend.',
			)
			.setImage('https://cdn.apexstats.dev/Examples/KillsExample.png');

		interaction.editReply({ embeds: [killEmbed] });
	},
};
