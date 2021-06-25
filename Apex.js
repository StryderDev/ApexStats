const config = require("./config.json");
const Commando = require("discord.js-light-commando");

const client = new Commando.Client({
	owner: "360564818123554836",
	commandPrefix: ">>",
	disabledEveryone: true,
	cacheGuilds: true,
	cacheChannels: true,
	cacheOverwrites: false,
	cacheRoles: false,
	cacheEmojis: false,
	cachePresences: false,
});

require("./events.js")(client);

client.login(config.discord.token).catch(console.error);

process.on("unhandledRejection", (error) => {
	console.log(chalk`{red Error: ${error}}`);
});

module.exports = {
	client: client,
	Discord: require("discord.js-light"),
};
