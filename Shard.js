const { ShardingManager } = require('discord.js');
const chalk = require('chalk');
const { DateTime } = require('luxon');
const Cluster = require('discord-hybrid-sharding');

const { discord } = require('./config.json');

const manager = new Cluster.Manager('./Apex.js', { mode: 'process', token: discord.token });

manager.on('clusterCreate', shard => {
	const time = `[${DateTime.local().toFormat('hh:mm:ss')}]`;

	console.log(chalk`{yellow ${time} - Spawning Cluster ${shard.id}... -}`);
	console.log(chalk`{green ${time} - Cluster ${shard.id} Spawned -}`);
});

manager.spawn(undefined, undefined, -1);
