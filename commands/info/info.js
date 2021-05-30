require("dotenv").config();

const chalk = require("chalk");
const {Command} = require("discord.js-light-commando");
const {checkMsg} = require("../functions/checkMsg.js");
const {MessageEmbed} = require("discord.js");
const {version} = require("../../package.json");
const config = require("../../config.json");

let mysql = require("mysql");
let connection = mysql.createPool({
  host: config.SQL.host,
  user: config.SQL.username,
  password: config.APISQL.password,
  database: config.APISQL.database,
});

module.exports = class MapCommand extends Command {
  constructor(client) {
    super(client, {
      name: "info",
      group: "info",
      memberName: "info",
      description: "Shows bot info.",
      examples: ["info"],
    });
  }
  onError(error) {
    console.log(chalk`{red Error: ${error}}`);
  }
  async run(msg) {
    if (checkMsg(msg) == 1) return;

    var botName = `${this.client.user.username}#${this.client.user.discriminator}`;
    var userQuery = `SELECT COUNT(*) AS UserCount FROM ${config.APISQL.usersTable}`;
    var shardGuildCount = this.client.guilds.cache.size.toLocaleString();

    const getServerCount = async () => {
      // get guild collection size from all the shards
      const req = await this.client.shard.fetchClientValues("guilds.cache.size");

      // return the added value
      return req.reduce((p, n) => p + n, 0);
    };

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

        let days = Math.floor(process.uptime() / 86400);
        let hours = Math.floor(process.uptime() / 3600) % 24;
        let minutes = Math.floor(process.uptime() / 60) % 60;
        let seconds = Math.floor(process.uptime()) % 60;

        function memUsage() {
          return `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;
        }

        getServerCount().then((count) => {
          const embed = new MessageEmbed()
            .setTitle(botName)
            .setThumbnail(process.env.BOT_ICON)
            .setDescription(
              "This bot has the ability to show user stats, events, in-game map rotations, server status, and more. Use `>>commands` to see commands available to the bot."
            )
            //.addField(
            //  "Bot Info",
            //  `**Version:** ${version}\n**Total Guilds**: ${count.toLocaleString()}\n**Guild Shard ID:** ${
            //    msg.guild.shardID
            //  }\n**Guilds on Shard**: ${shardGuildCount}\n**Players Tracked**: ${results[0].UserCount.toLocaleString()}\n**Memory Usage:** ${(
            //    process.memoryUsage().heapUsed /
            //    1024 /
            //    1024
            //  ).toFixed(2)} MB`,
            //  true
            //)
            .addField(
              "Bot Stats",
              `**Version**: ${version}\n**Players Tracked**: ${results[0].UserCount.toLocaleString()}\n**Uptime**: ${days}d, ${hours}h, ${minutes}m, ${seconds}s\n**Memory Usage**: ${memUsage()}`,
              true
            )
            .addField(
              "Useful Links",
              `[Trello](https://apexstats.dev/trello)\n[Stats Site](https://apexstats.dev/)\n[Invite Bot](https://apexstats.dev/invite)\n[Github Repo](https://apexstats.dev/github)\n[Support Server](https://discord.gg/eH8VxssFW6)`,
              true
            )
            .addField("\u200b", "\u200b", true)
            .addField(
              "Bot Guild/Shard Info",
              `**Total Shards**: ${config.shards}\n**Guild Shard ID**: ${msg.guild.shardID + 1}/${
                config.shards
              }`,
              true
            )
            .addField(
              "\u200b",
              `**Guilds on Shard**: ${shardGuildCount}\n**Total Guild Count**: ${count.toLocaleString()}`,
              true
            )
            .setFooter(process.env.CREATOR_NAME, process.env.CREATOR_LOGO)
            .addField("\u200b", "\u200b", true)
            .setTimestamp();

          msg.say(embed);
        });
      });
    });
  }
};
