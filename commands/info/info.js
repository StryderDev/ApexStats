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
  run(msg) {
    if (checkMsg(msg) == 1) return;

    var userQuery = `SELECT COUNT(*) AS UserCount FROM ${config.APISQL.usersTable}`;

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

        const embed = new MessageEmbed()
          .setTitle(`Apex Legends Stats Bot`)
          .setThumbnail(process.env.BOT_ICON)
          .setDescription(
            "This bot has the ability to show user stats, events, in-game map rotations, server status, and more. Use `>>commands` to see commands available to the bot."
          )
          .addField(
            "Bot Info",
            `**Version:** ${version}\n**Players Tracked**: ${results[0].UserCount.toLocaleString()}\n**Memory Usage:** ${(
              process.memoryUsage().heapUsed /
              1024 /
              1024
            ).toFixed(2)} MB`,
            true
          )
          .addField(
            "Useful Links",
            `[Trello](https://apexstats.dev/trello)\n[Stats Site](https://apexstats.dev/)\n[Github Repo](https://apexstats.dev/github)\n[Support Server](https://apexstats.dev/invite)`,
            true
          )
          .setFooter(process.env.CREATOR_NAME, process.env.CREATOR_LOGO)
          .setTimestamp();

        msg.say(embed);
      });
    });
  }
};
