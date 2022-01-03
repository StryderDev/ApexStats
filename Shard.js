const { ShardingManager } = require('discord.js');
const { discord } = require('./config.json');

const chalk = require('chalk');

const manager = new ShardingManager('./Apex.js', { token: discord.token });

manager.on('shardCreate', shard => {
	console.log(chalk`{yellow.bold [> Launching Shard...]}`);
	console.log(chalk`{green.bold [> Shard #${shard.id} Launched]}`);
});

manager.spawn();
