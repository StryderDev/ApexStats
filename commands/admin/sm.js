const chalk = require("chalk");
const {MessageEmbed} = require("discord.js");
const {Command} = require("discord.js-light-commando");
const {checkMsg} = require("../functions/checkMsg.js");

module.exports = class MapCommand extends Command {
  constructor(client) {
    super(client, {
      name: "sm",
      group: "admin",
      memberName: "sm",
      description: "N/A. Only usable by bot owner.",
      examples: ["SM"],
    });
  }
  onError(error) {
    console.log(chalk`{red Error: ${error}}`);
  }
  hasPermission(msg) {
    return this.client.isOwner(msg.author);
  }
  run(msg) {
    if (checkMsg(msg) == 1) return;

    const placeholderEmbed = new MessageEmbed()
      .setTitle("Placeholder")
      .setDescription(
        "This is a placeholder embed, and will be replaced when the module is set up."
      );

    msg.say(placeholderEmbed);
  }
};
