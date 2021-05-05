const chalk = require("chalk");
const {MessageEmbed} = require("discord.js");
const {Command} = require("discord.js-light-commando");
const {checkMsg} = require("../functions/checkMsg.js");

module.exports = class MapCommand extends Command {
  constructor(client) {
    super(client, {
      name: "commands",
      aliases: ["help"],
      group: "info",
      memberName: "commands",
      description: "Shows bot commands.",
      examples: ["info"],
    });
  }
  onError(error) {
    console.log(chalk`{red Error: ${error}}`);
  }
  run(msg) {
    if (checkMsg(msg) == 1) return;

    const embed = new MessageEmbed()
      .setTitle("Bot Commands")
      .addField(
        "Commands",
        ">>drop\n>>who\n>>commands\n>>command\n>>legend\n>>news\n>>season\n>>stats\n>>info\n>>invite\n>>privacypolicy\n>>map\n>>status",
        true
      );

    msg.say(embed);
  }
};
