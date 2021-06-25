const config = require("./config.json");
const Commando = require("discord.js-light-commando");
const path = require("path");
const chalk = require("chalk");
const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

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

client.setMaxListeners(15);

require("./events/events.js")(client);

client.registry
	.registerDefaultTypes()
	.registerGroups(["info", "game info"])
	.registerDefaultGroups()
	.registerDefaultCommands({ help: false, unknownCommand: false })
	.registerCommandsIn(path.join(__dirname, "commands"));

client.setProvider(
	sqlite.open({ filename: "database.db", driver: sqlite3.Database }).then((db) => new Commando.SQLiteProvider(db))
);

client.login(config.discord.token).catch(console.error);

process.on("unhandledRejection", (error) => {
	console.log(chalk`{red Error: ${error}}`);
});

module.exports = {
	client: client,
	Discord: require("discord.js-light"),
};
