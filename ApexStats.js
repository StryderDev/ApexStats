const Commando = require("discord.js-light-commando");
const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");
const buttons = require("discord-buttons");

const client = new Commando.Client({
  owner: "360564818123554836",
  commandPrefix: ">>",
  disableEveryone: true,
  invite: "https://discord.gg/eH8VxssFW6",
  cacheRoles: true,
  cacheGuilds: true,
  cacheEmojis: true,
  cacheChannels: true,
  cachePresences: false,
  cacheOverwrites: false,
});

client.setMaxListeners(15);

const path = require("path");

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ["admin", "Admin only commands."],
    ["utility", "Map/Event/Other Information"],
    ["fun", "Fun commands"],
    ["info", "Game Info"],
    ["comp", "ALGS Info"],
    ["misc", "Uncategorized"],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({ help: false, unknownCommand: false })
  .registerCommandsIn(path.join(__dirname, "commands"));

client
  .setProvider(
    sqlite
      .open({ filename: "database.db", driver: sqlite3.Database })
      .then((db) => new Commando.SQLiteProvider(db))
  )
  .catch(console.error);

require("./events.js")(client);
require("./rotations.js")(client);

// For the Button-Framework to work
buttons(client);

// Button Pagination Framework
const button = require('./framework/pagination')
button(client)

const config = require("./config.json");

process.on("unhandledRejection", (error) => {
  console.log(error.message, "error");
});

module.exports = {
  client: client,
  Discord: require("discord.js-light"),
};

// Login to Discord
client.login(config.token);
