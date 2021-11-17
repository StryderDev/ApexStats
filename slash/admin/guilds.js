const { Client, CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'guilds',
	description: 'Get guild count.',
	type: 'CHAT_INPUT',
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		client.shard
			.broadcastEval(client => [client.shard.ids, client.ws.status, client.ws.ping, client.guilds.cache.size])
			.then(results => {
				const embed = new MessageEmbed()
					.setTitle(`👨‍💻 Bot Shards (${interaction.client.shard.count})`)
					.setColor('#ccd6dd')
					.setTimestamp();

				results.map(data => {
					embed.addField(
						`📡 Shard ${data[0]}`,
						`**Status:** ${data[1]}\n**Ping:** ${data[2]}ms\n**Guilds:** ${data[3]}`,
						false,
					);
				});
				interaction.followUp({ embeds: [embed] });
			})
			.catch(error => {
				console.error(error);
				interaction.reply(`❌ Error.`);
			});
	},
};
