const Cluster = require('discord-hybrid-sharding');

let { token } = require('./config.json');

const manager = new Cluster.Manager(`${__dirname}/Apex.js`, {
	totalShards: 'auto',
	mode: 'process',
	token: token,
	usev13: true,
});

manager.on('clusterCreate', cluster => console.log(`Launched Cluster ${cluster.id}`));
manager.spawn(undefined, undefined, -1);
