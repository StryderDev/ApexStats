require("dotenv").config();

const {client, Discord} = require("../ApexStats.js");
const config = require("../config.json");
const {version} = require("../package.json");

let mysql = require("mysql");
let connection = mysql.createPool({
  host: config.SQL.host,
  user: config.SQL.username,
  password: config.APISQL.password,
  database: config.APISQL.database,
});

module.exports = {
  name: "info",
  description: "Shows info about the bot.",
  execute(message) {
    var uptime = client.uptime;

    let days = Math.floor(client.uptime / 86400000);
    let hours = Math.floor(client.uptime / 3600000) % 24;
    let minutes = Math.floor(client.uptime / 60000) % 60;
    let seconds = Math.floor(client.uptime / 1000) % 60;

    var userQuery = "SELECT COUNT(*) AS UserCount FROM UsersV2";

    connection.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        return message.channel.send(
          "There was an error connecting to the database. Please try again later."
        );
      }

      connection.query(userQuery, function (err, results) {
        if (err) {
          connection.release();
          console.log(err);
          return message.channel.send(
            "There was a problem with the SQL syntax. Please try again later."
          );
        }

        const infoEmbed = new Discord.MessageEmbed()
          .setTitle(`Apex Legends Stats Bot (${client.user.username}#${client.user.discriminator})`)
          .setColor("C21D27")
          .setThumbnail(process.env.BOT_ICON)
          .setDescription(
            `This bot has the ability to show user stats, events, in-game map rotations, server status, and more. Use \`${config.prefix}commands\` to see commands available to the bot.`
          )
          .addField(
            "Bot Info",
            `**Version:** ${version}\n**Users Tracked:** ${results[0].UserCount.toLocaleString()}`,
            true
          )
          .addField(
            "Guilds/Members",
            `**Shard Count:** ${client.shard.count}\n**Guild Shard ID:** ${
              message.guild.shardID
            }\n**Guild Count:** ${client.guilds.cache.size.toLocaleString()}\n**Member Count:** ${message.client.guilds.cache
              .map((g) => g.memberCount)
              .reduce((a, c) => a + c)
              .toLocaleString()}`,
            true
          )
          .addField("\u200b", "\u200b")
          .addField(
            "Mem Usage",
            `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            true
          )
          .addField("Uptime", `${days}d, ${hours}h, ${minutes}m, ${seconds}s`, true)
          .addField(
            "Useful Links",
            `[Stats Site](https://apexstats.dev/)\n[Support Server](https://apexstats.dev/invite)\n[Github Repo](https://apexstats.dev/github)\n[Trello](https://apexstats.dev/trello)`,
            true
          )
          .setFooter(process.env.CREATOR_NAME, process.env.CREATOR_LOGO)
          .setTimestamp();

        message.channel.send(infoEmbed);
        connection.release();
      });
    });
  },
};
