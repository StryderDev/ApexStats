const { Client, CommandInteraction } = require('discord.js');

module.exports = {
	name: 'ping',
	description: 'Returns current API Ping Message Latency.',
	type: 'CHAT_INPUT',
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		await interaction
			.followUp({ content: 'Detecting API and Message Latency...' })
			.then(i =>
				interaction.editReply(
					`**API Latency:** \`${Math.round(client.ws.ping)}ms\`\n**Message Latency:** \`${
						i.createdTimestamp - interaction.createdTimestamp
					}ms\``,
				),
			)
			.catch(e => interaction.reply(e));
	},
};
