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
			required: true,
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
			required: true,
		},
	],
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const platform = args[0];
		const username = args[1];

		if (platform == 'Switch')
			return await interaction.followUp({
				content: 'Unfortunately, stats for the Nintendo Switch are currently not supported.',
			});

		await interaction.followUp({ embeds: [embed] }).catch(e => interaction.editReply(e));
	},
};
