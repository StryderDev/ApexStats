const { Client, CommandInteraction } = require('discord.js');

module.exports = {
	name: 'ping',
	description: 'Returns current websocket ping.',

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		interaction.followUp({
			content: `API Latency is ${Math.round(client.ws.ping)}ms.`,
		});
	},
};
