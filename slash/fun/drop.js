const { Client, CommandInteraction } = require('discord.js');

module.exports = {
	name: 'drop',
	description: 'returns deez nuts ping',
	type: 'CHAT_INPUT',
	options: [
		{
			name: 'map',
			type: 'STRING',
			description: 'Choose which map you want a rotation from.',
			required: true,
			choices: [
				{
					name: 'Kings Canyon',
					value: 'KingsCanyon',
				},
				{
					name: "World's Edge",
					value: 'WorldsEdge',
				},
				{
					name: 'Olympus',
					value: 'Olympus',
				},
			],
		},
	],
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const map = args[0];

		const mapFile = require(`../../data/maps/${map}.json`);

		await interaction
			.followUp({ content: 'Choosing a spot to drop...' })
			.then(i => interaction.editReply(`Drop on **${mapFile[Math.floor(Math.random() * mapFile.length)]}**.`))
			.catch(e => interaction.editReply(e));
	},
};
