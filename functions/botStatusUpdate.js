const client = require('../Apex.js');
const { botStatus } = require('../config.json');
const chalk = require('chalk');
const { DateTime } = require('luxon');
const { MessageEmbed } = require('discord.js');
const { version } = require('../package.json');
const { isPlural } = require('./misc.js');
const axios = require('axios');
const gauge = require('cpu-gauge');

var cpu = gauge.start();

async function updateBotStatus() {
	const getServerCount = async () => {
		const req = await client.shard.fetchClientValues('guilds.cache.size');

		return req.reduce((p, n) => p + n, 0);
	};

	const getUserCount = async () => {
		return client.guilds.cache.map(guild => guild.memberCount).reduce((a, b) => a + b, 0);
	};

	const servers = await getServerCount();
	const users = await getUserCount();

	let days = Math.floor(process.uptime() / 86400);
	let hours = Math.floor(process.uptime() / 3600) % 24;
	let minutes = Math.floor(process.uptime() / 60) % 60;

	var memoryUsage = process.memoryUsage().heapUsed / (1024 * 1024);

	try {
		const apiCount = await axios.get('https://api.apexstats.dev/playerCount');

		const map = new MessageEmbed()
			.setTitle(`Apex Legends Stats Bot \`V${version}\``)
			.setDescription(
				`<:Uptime:896958688781283329> Uptime: ${isPlural(days, 'day')}, ${isPlural(hours, 'hour')}, ${isPlural(
					minutes,
					'minute',
				)}`,
			)
			.addField(
				'Bot Info',
				`<:GuildIcon:896947200008019978> Server Count: ${servers.toLocaleString()}\n<:ShardCount:896952210171261010> Shard Count: ${
					client.config.discord.shards
				}`,
				true,
			)
			.addField(
				'Process Info',
				`<:CPU:896972486766366741> CPU Usage: ${cpu
					.usage()
					.percent.toFixed(2)}%\n<:RAM:896972691737837598> RAM Usage: ${memoryUsage.toFixed(2)} MB`,
				true,
			)
			.addField(
				'API Info',
				`<:UserCount:896957419840753684> Players Tracked: ${apiCount.data.count.toLocaleString()}`,
				true,
			)
			.setTimestamp();

		const guild = client.guilds.cache.get(botStatus.guild);
		if (!guild) return;

		const channel = guild.channels.cache.find(c => c.id === botStatus.channel && c.type === 'GUILD_TEXT');
		if (!channel) return;

		try {
			const message = channel.messages.fetch(botStatus.message);
			if (!message) return; // console.log('Unable to find message.');

			channel.messages.fetch(botStatus.message).then(msg => {
				msg.edit({ embeds: [map] });
			});

			console.log(chalk`{blue.bold [${DateTime.local().toFormat('hh:mm:ss')}] Updated Bot Status Embed}`);
		} catch (err) {
			console.error(`Other Error: ${err}`);
		}
	} catch (err) {
		console.log(`Axios Error: ${err}`);
	}
}

module.exports = { updateBotStatus };
