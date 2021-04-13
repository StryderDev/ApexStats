//const Discord = require("discord.js-light");
const Discord = require("discord.js");
const client = new Discord.Client({
  cacheRoles: true,
  cacheGuilds: true,
  cacheEmojis: true,
  cacheChannels: true,
  cachePresences: false,
  cacheOverwrites: false,
  shards: [0],
});

require("./functions.js")(client);

const config = require("./config.json");

process.on("unhandledRejection", (error) => {
  console.log(error.message, "error");
});

module.exports = {
  client: client,
  //Discord: require("discord.js-light"),
  Discord: require("discord.js"),
};

// Login to Discord
client.login(config.token);
