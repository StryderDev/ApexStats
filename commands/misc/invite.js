const chalk = require("chalk");
const {Command} = require("discord.js-light-commando");
const {checkMsg} = require("../functions/checkMsg.js");

module.exports = class MapCommand extends Command {
  constructor(client) {
    super(client, {
      name: "invite",
      group: "misc",
      memberName: "invite",
      description: "Shows the bot invite.",
      examples: ["invite"],
    });
  }
  onError(error) {
    console.log(chalk`{red Error: ${error}}`);
  }
  run(msg) {
    if (checkMsg(msg) == 1) return;

    msg.say("Invite the bot to your server: <https://apexstats.dev/invite>");
  }
};
