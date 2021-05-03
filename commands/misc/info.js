const chalk = require("chalk");
const {Command} = require("discord.js-light-commando");
const {checkMsg} = require("../functions/checkMsg.js");
const config = require("../../config.json");
const {version} = require("../../package.json");

let mysql = require("mysql");
const {MessageEmbed} = require("discord.js");
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
      group: "misc",
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

    let days = Math.floor(Command.uptime / 86400000);
    let hours = Math.floor(Command.uptime / 3600000) % 24;
    let minutes = Math.floor(Command.uptime / 60000) % 60;
    let seconds = Math.floor(Command.uptime / 1000) % 60;

    var userCount = "SELECT COUNT(*) AS UserCount FROM UsersV2";

    connection.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        return message.channel.send(
          "There was an error connecting to the database. Please try again later."
        );
      }

      connection.query(userCount, function (err, results) {
        if (err) {
          connection.release();
          console.log(err);
          return message.channel.send(
            "There was a problem with the SQL syntax. Please try again later."
          );
        }

        const embed = new MessageEmbed()
          .setTitle(`Apex Legends Stats Bot`)
          .addField(
            "Mem Usage",
            `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            true
          )
          .addField("Uptime", `${days}d, ${hours}h, ${minutes}m, ${seconds}s`, true);

        msg.say(embed);
      });
    });
  }
};
