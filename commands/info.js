const { client, Discord } = require("../ApexStats.js");
require("dotenv").config();
const config = require("../config.json");

module.exports = {
  name: "info",
  description: "Info about the bot.",
  execute(message, args) {
    const info = new Discord.MessageEmbed()
      .setTitle("Apex Legends Stats Bot")
      .setColor("C21D27")
      .setThumbnail(process.env.BOT_ICON)
      .setDescription(
        "This bot has the ability to show user legend stats, news, and server status."
      )
      .addField("Bot Version", process.env.BOT_VERSION, true)
      .addField("Last Updated", process.env.LAST_UPDATED, true)
      .addField("Server Count", `${client.guilds.cache.size} Servers`, true)
      .addField("Support Server", process.env.SUPPORT_SERVER)
      .addField("GitHub Repo", process.env.REPO)
      .setFooter(process.env.CREATOR_NAME, process.env.CREATOR_LOGO)
      .setTimestamp();

    message.channel.send(info);
  },
};
