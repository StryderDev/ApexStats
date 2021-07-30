// Discord Client
const { Client, Collection } = require("discord.js");
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

module.exports = client;

// On Ready
client.once("ready", async () => {
  console.log("Ready!");
});

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require("./config.json");

// Initializing Command Handler
require("./handler")(client);

// Login
client.login(client.config.discord.token);
