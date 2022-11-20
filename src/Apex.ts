import config from './botConfig';

const { Client, GatewayIntentBits, Partials } = require('discord.js');

const { Guilds } = GatewayIntentBits;
const {} = Partials;

const client = new Client({ intents: [Guilds] });

client.login(config.token).then(() => console.log('Logged in.'));
