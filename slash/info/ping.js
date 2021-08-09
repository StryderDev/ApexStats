const { Client, CommandInteraction } = require('discord.js');

module.exports = {
	name: 'ping',
	description: 'Returns websocket ping.',

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		interaction.followUp({ content: `Current Websocket Ping: ${client.ws.ping}ms` });
	},
};
