import config from './botConfig';
import loadEvents from './loadEvents';

const { Client, GatewayIntentBits, Partials } = require('discord.js');

const { Guilds } = GatewayIntentBits;
const {} = Partials;

const client = new Client({ intents: [Guilds] });

client
	.login(config.token)
	.then(() => loadEvents(client))
	.catch(err => console.log(err));
