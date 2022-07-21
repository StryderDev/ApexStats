const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { Misc, serverStatus } = require('../../data/emotes.json');
const package = require('../../../package.json');
const { release } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder().setName('shards').setDescription('Shows info about the bots shards.'),
	async execute(interaction) {
		interaction.client.shard
			.broadcastEval(client => [client.shard.ids, client.ws.status, client.ws.ping, client.guilds.cache.size, client.uptime])
			.then(results => {
				const embed = new MessageEmbed()
					.setTitle('Apex Stats - Shard Info')
					.setColor('2F3136')
					.setFooter({ text: `Stryder Dev - v${package.version} "${release.name}"` });

				results.map(data => {
					switch (data[1]) {
						case 0:
							var statusType = serverStatus.Online;
							break;
						case 1:
							var statusType = serverStatus.Slow;
							break;
						case 2:
							var statusType = serverStatus.Slow;
							break;
						case 3:
							var statusType = serverStatus.Slow;
							break;
						case 4:
							var statusType = serverStatus.Slow;
							break;
						case 5:
							var statusType = serverStatus.Down;
							break;
						case 6:
							var statusType = serverStatus.Slow;
							break;
						case 7:
							var statusType = serverStatus.Slow;
							break;
						case 8:
							var statusType = serverStatus.Online;
							break;
						default:
							var statusType = serverStatus.Down;
							break;
					}

					const uptime = data[4] / 1000;
					const seconds = Math.floor(uptime % 60);
					const minutes = Math.floor((uptime % (60 * 60)) / 60);
					const hours = Math.floor(uptime / (60 * 60)) % 24;
					const days = Math.floor(uptime / 86400);

					embed.addField(
						`${Misc.Shard} Shard #${data[0]}`,
						`**Status:** ${statusType}\n**Ping:** ${data[2]}ms\n**Guilds:** ${data[3].toLocaleString()}\n**Uptime**\n\`${days}d, ${hours}h, ${minutes}m, ${seconds}s\``,
						true,
					);
				});

				interaction.editReply({ embeds: [embed] });
			})
			.catch(error => {
				console.error(error);
				interaction.editReply('There was an error. Shards are likely still spawning. Please wait then try again.');
			});
	},
};
