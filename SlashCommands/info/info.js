const { CommandInteraction, MessageEmbed } = require('discord.js');
const { version } = require('../../package.json');
const config = require('../../config.json');
const axios = require('axios');

require('dotenv').config();

module.exports = {
	name: 'info',
	description: 'Bot info.',

	run: async (client, interaction) => {
		const getServerCount = async () => {
			// get guild collection size from all the shards
			const req = await client.shard.fetchClientValues('guilds.cache.size');

			// return the added value
			return req.reduce((p, n) => p + n, 0);
		};

		getServerCount().then(count => {
			var botName = `${client.user.username}#${client.user.discriminator}`;
			var shardGuildCount = client.guilds.cache.size.toLocaleString();

			let days = Math.floor(process.uptime() / 86400);
			let hours = Math.floor(process.uptime() / 3600) % 24;
			let minutes = Math.floor(process.uptime() / 60) % 60;
			let seconds = Math.floor(process.uptime()) % 60;

			function memUsage() {
				return `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;
			}

			axios.get(`https://api.apexstats.dev/playerCount`).then(result => {
				const count = result.data.count;

				const embed = new MessageEmbed()
					.setTitle(botName)
					.setThumbnail(process.env.BOT_ICON)
					.setDescription(
						'This bot has the ability to show user stats, events, in-game map rotations, server status, and more. Use `/commands` to see commands available to the bot.',
					)
					.addField(
						'Bot Stats',
						`**Version**: ${version}\n**Uptime**: ${days}d, ${hours}h, ${minutes}m, ${seconds}s\n**Memory Usage**: ${memUsage()}\n**Players Tracked**: ${count.toLocaleString()}`,
						true,
					)
					.addField(
						'Useful Links',
						`[Trello](https://apexstats.dev/trello)\n[Ranked Leaderboards](https://ranked.apexstats.dev/)\n[Invite Bot](https://apexstats.dev/invite)\n[Github Repo](https://apexstats.dev/github)\n[Support Server](https://discord.gg/eH8VxssFW6)`,
						true,
					)
					.addField('\u200b', '\u200b', true)
					.addField(
						'Bot Guild/Shard Info',
						`**Total Shards**: ${config.discord.shards}\n**Guild Shard ID**: ${client.shard.ids[0] + 1}/${
							config.discord.shards
						}`,
						true,
					)
					.addField(
						'\u200b',
						`**Guilds on Shard**: ${shardGuildCount}\n**Total Guild Count**: ${count.toLocaleString()}`,
						true,
					)
					.addField('\u200b', '\u200b', true)
					.setFooter(process.env.CREATOR_NAME, process.env.CREATOR_LOGO);

				interaction.editReply({ embeds: [embed] });
			});
		});
	},
};
