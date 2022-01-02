const { ShardingManager } = require('discord.js');
const { discord } = require('./config.json');

const manager = new ShardingManager('./Apex.js', { token: discord.token });

manager.on('shardCreate', shard => {
	console.log(`Launching Shard...`);
	console.log(`Shard #${shard.id} Launched`);
});

manager.spawn();
