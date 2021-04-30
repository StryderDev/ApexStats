const chalk = require("chalk");
const {Command} = require("discord.js-light-commando");
const {MessageEmbed} = require("discord.js");
const {checkMsg} = require("../functions/checkMsg.js");
const config = require("../../config.json");

let mysql = require("mysql");
let connection = mysql.createPool({
  host: config.SQL.host,
  user: config.SQL.username,
  password: config.SQL.password,
  database: config.SQL.database,
});

module.exports = class MapCommand extends Command {
  constructor(client) {
    super(client, {
      name: "privacypolicy",
      group: "misc",
      memberName: "privacypolicy",
      description: "Shows the bots privacy policy.",
      examples: ["privacypolicy"],
    });
  }
  onError(error) {
    console.log(chalk`{red Error: ${error}}`);
  }
  run(msg, {name}) {
    if (checkMsg(msg) == 1) return;

    msg.say("Privacy Policy: https://apexstats.dev/privacypolicy.php");
  }
};
