//const Discord = require("discord.js-light");
//const client = new Discord.Client({
//  cacheRoles: true,
//  cacheGuilds: true,
//  cacheEmojis: true,
// cacheChannels: true,
//  cachePresences: false,
//  cacheOverwrites: false,
//});

const Commando = require("discord.js-light-commando");
const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

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

const path = require("path");

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ["utility", "Map/Event/Other Information"],
    ["fun", "Fun commands"],
    ["info", "Game Info"],
    ["comp", "ALGS Info"],
    ["misc", "Uncategorized"],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({help: false, unknownCommand: false})
  .registerCommandsIn(path.join(__dirname, "commands"));

client
  .setProvider(
    sqlite
      .open({filename: "database.db", driver: sqlite3.Database})
      .then((db) => new Commando.SQLiteProvider(db))
  )
  .catch(console.error);

require("./functions.js")(client);

const config = require("./config.json");

process.on("unhandledRejection", (error) => {
  console.log(error.message, "error");
});

module.exports = {
  client: client,
  //Discord: require("discord.js-light"),
  Discord: require("discord.js-light"),
};

// Login to Discord
client.login(config.token);
