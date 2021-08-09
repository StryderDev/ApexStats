const { ShardingManager } = require('discord.js');
const chalk = require('chalk');
const { DateTime } = require('luxon');
const Cluster = require('discord-hybrid-sharding');

const { discord } = require('./config.json');

const manager = new Cluster.Manager('./Apex.js', { mode: 'process', token: discord.token });

manager.on('clusterCreate', cluster => {
	const time = `[${DateTime.local().toFormat('hh:mm:ss')}]`;

	console.log(chalk`{yellow ${time} Spawning Cluster ${cluster.id}...}`);
	console.log(chalk`{green ${time} Cluster ${cluster.id} Spawned}`);
});

manager.spawn(undefined, undefined, -1);
