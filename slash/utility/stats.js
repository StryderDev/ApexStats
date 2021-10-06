const { Client, CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'stats',
	description: 'Show your in-game legend stats.',
	type: 'CHAT_INPUT',
	options: [
		{
			name: 'platform',
			type: 'STRING',
			description: 'Pick your platform.',
			require: true,
			choices: [
				{
					name: 'PC (Origin/Steam)',
					value: 'PC',
				},
				{
					name: 'Xbox',
					value: 'X1',
				},
				{
					name: 'PlayStation (PS4/PS5)',
					value: 'PS4',
				},
				{
					name: 'Nintendo Switch',
					value: 'Switch',
				},
			],
		},
		{
			name: 'username',
			type: 'STRING',
			description: 'Your in-game username.',
			require: true,
		},
	],
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const embed = new MessageEmbed()
			.setTitle('Module Title')
			.setDescription('This will be updated when the module is configured.');

		await interaction.followUp({ embeds: [embed] }).catch(e => interaction.editReply(e));
	},
};
