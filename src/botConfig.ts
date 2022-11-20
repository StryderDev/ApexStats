const { discord } = require('../config.json');

if (!discord.devClient || !discord.token) throw new Error('Missing discord config values in config.json.');

const devClient = discord.devClient;
const token = discord.token;

const config: Record<string, string> = {
	devClient,
	token,
};

export default config;
