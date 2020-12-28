require("dotenv").config();

const { client, Discord } = require("../ApexStats.js");
const config = require("../config.json");

module.exports = {
  name: "info",
  description: "Shows info about the bot.",
  execute(message) {
    const infoEmbed = new Discord.MessageEmbed()
      .setTitle(
        `Apex Legends Stats Bot (${client.user.username}#${client.user.discriminator})`
      )
      .setColor("C21D27")
      .setThumbnail(process.env.BOT_ICON)
      .setDescription(
        `This bot has the ability to show user stats, events, in-game map rotations, server status, and more. Use \`${config.prefix}commands\` to see commands available to the bot.`
      )
      .addField("Bot Version", process.env.BOT_VERSION, true)
      .addField("Last Updated", process.env.LAST_UPDATED, true)
      .addField(
        "Bot Stats",
        `**Shard Count:** ${client.shard.count}\n**Guild Shard ID:** ${message.guild.shardID}\n**Guild Count:** ${client.guilds.cache.size}`,
        true
      )
      .addField("Support Server", process.env.SUPPORT_SERVER)
      .addField("GitHub Repo", process.env.REPO)
      .addField("Trello", process.env.TRELLO)
      .setFooter(process.env.CREATOR_NAME, process.env.CREATOR_LOGO)
      .setTimestamp();

    message.channel.send(infoEmbed);
  },
};
