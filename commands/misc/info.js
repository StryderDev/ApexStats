const chalk = require("chalk");
const {Command} = require("discord.js-light-commando");
const {checkMsg} = require("../functions/checkMsg.js");
const config = require("../../config.json");
const {version} = require("../../package.json");
const {MessageEmbed} = require("discord.js");

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

    const embed = new MessageEmbed()
      .setTitle(`Apex Legends Stats Bot`)
      .addField(
        "Mem Usage",
        `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
        true
      );

    msg.say(embed);
  }
};
