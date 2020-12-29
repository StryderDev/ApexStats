const Discord = require("discord.js-light");
const client = new Discord.Client({
  cacheRoles: true,
  cacheGuilds: true,
  cacheEmojis: true,
  cacheChannels: true,
  cachePresences: false,
  cacheOverwrites: false,
});

require("./functions.js")(client);

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
