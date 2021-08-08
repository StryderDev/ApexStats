const { Client, CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'killhelp',
	description: 'Information about tracked kills.',

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		const kills = new MessageEmbed()
			.setTitle('Kill Logging')
			.setDescription(
				'We\'re only able to record kills from a certain legend if you have the "Kills" or "Arena Kills" tracker enabled on a legend.\n\nIn order to calculate your total kills, equip one of the two (or both!) trackers and run the command on each legend.',
			)
			.setImage('https://cdn.apexstats.dev/Examples/KillsExample.png');

		interaction.followUp({
			embeds: [kills],
		});
	},
};
