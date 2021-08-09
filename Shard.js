const { ShardingManager } = require('discord.js');
const chalk = require('chalk');
const { DateTime } = require('luxon');

const { discord } = require('./config.json');

const manager = new ShardingManager('./Apex.js', { token: discord.token, totalShards: discord.shards });

manager.on('shardCreate', shard => {
	const time = `[${DateTime.local().toFormat('hh:mm:ss')}]`;

	console.log(chalk`{yellow ${time} - Spawning Shard ${shard.id}... -}`);
	console.log(chalk`{green ${time} - Shard ${shard.id} Spawned -}`);
});

manager.spawn();
