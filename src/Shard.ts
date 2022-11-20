import config from './botConfig';

const path = require('path');
const { ShardingManager } = require('discord.js');

const manager = new ShardingManager(path.join(__dirname, '/Apex.js'), { token: config.token, totalShards: 'auto' });

manager.on('shardCreate', shard => console.log(`Launched Shard ${shard.id}`));

manager.spawn();
