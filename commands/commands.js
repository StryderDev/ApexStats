const { client, Discord } = require("../ApexStats.js");
require("dotenv").config();
const config = require("../config.json");

module.exports = {
  name: "commands",
  description: "Commands available to the bot.",
  execute(message, args) {
    const info = new Discord.MessageEmbed()
      .setTitle("Apex Legends Stats Bot")
      .setColor("C21D27")
      .setThumbnail(process.env.BOT_ICON)
      .addField(
        `${config.prefix}stats [platform] [username]`,
        "Shows user stats. Platform can be PC, X1, or PS4."
      )
      .addField(
        `${config.prefix}status`,
        "Shows current Apex Legends server status.",
        true
      )
      .addField(
        `${config.prefix}news`,
        "Shows the latest news article from the official Apex Legends blog.",
        true
      )
      .addField(
        `${config.prefix}info`,
        "Shows basic information about the bot.",
        true
      )
      .addField(
        `${config.prefix}legend [legend name]`,
        "Shows information about a legend such as their backstory, age, home world, and abilities.",
        true
      )
      .addField(`${config.prefix}commands`, "Shows this embed.", true)
      .setFooter(process.env.CREATOR_NAME, process.env.CREATOR_LOGO)
      .setTimestamp();

    message.channel.send(info);
  },
};
