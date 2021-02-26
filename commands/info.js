require("dotenv").config();

const {client, Discord} = require("../ApexStats.js");
const config = require("../config.json");

module.exports = {
  name: "info",
  description: "Shows info about the bot.",
  execute(message) {
    var uptime = client.uptime;

    let days = Math.floor(client.uptime / 86400000);
    let hours = Math.floor(client.uptime / 3600000) % 24;
    let minutes = Math.floor(client.uptime / 60000) % 60;
    let seconds = Math.floor(client.uptime / 1000) % 60;

    const infoEmbed = new Discord.MessageEmbed()
      .setTitle(`Apex Legends Stats Bot (${client.user.username}#${client.user.discriminator})`)
      .setColor("C21D27")
      .setThumbnail(process.env.BOT_ICON)
      .setDescription(
        `This bot has the ability to show user stats, events, in-game map rotations, server status, and more. Use \`${config.prefix}commands\` to see commands available to the bot.`
      )
      .addField(
        "Bot Info",
        `**Version:** ${process.env.BOT_VERSION}\n**Last Updated:** ${process.env.LAST_UPDATED}`,
        true
      )
      .addField(
        "Guilds/Members",
        `**Shard Count:** ${client.shard.count}\n**Guild Shard ID:** ${
          message.guild.shardID
        }\n**Guild Count:** ${
          client.guilds.cache.size
        }\n**Member Count:** ${message.client.guilds.cache
          .map((g) => g.memberCount)
          .reduce((a, c) => a + c)
          .toLocaleString()}`,
        true
      )
      .addField(
        "Useful Links",
        `[Support Server](https://apexstats.dev/invite)\n[Github Repo](https://apexstats.dev/github)\n[Trello](https://apexstats.dev/trello)`,
        true
      )
      .addField(
        "Bot Stats",
        `**Uptime:** ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds\n**Mem Usage:** ${(
          process.memoryUsage().heapUsed /
          1024 /
          1024
        ).toFixed(2)} MB`
      )
      .setFooter(process.env.CREATOR_NAME, process.env.CREATOR_LOGO)
      .setTimestamp();

    message.channel.send(infoEmbed);
  },
};
