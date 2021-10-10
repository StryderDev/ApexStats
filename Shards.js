const { ShardingManager } = require('discord.js');
const config = require('./config.json');
const chalk = require('chalk');
const { DateTime } = require('luxon');

const timeLogs = DateTime.local().toFormat('hh:mm:ss');

const manager = new ShardingManager('./Apex.js', {
	totalShards: 'auto',
	token: config.discord.token,
});

manager.on('shardCreate', shard => console.log(chalk`{blue.bold [${timeLogs}] Shard Launched. ID: ${shard.id}}`));

manager.spawn();
