const { ShardingManager } = require('discord.js');

let { token } = require('./config.json');

const manager = new ShardingManager('./Apex.js', { token: token });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();
