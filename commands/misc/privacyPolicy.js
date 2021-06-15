const chalk = require("chalk");
const {Command} = require("discord.js-light-commando");
const {checkMsg} = require("../functions/checkMsg.js");
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
  run(msg) {
    if (checkMsg(msg) == 1) return;

    msg.channel.startTyping();

    msg.say("Privacy Policy: https://apexstats.dev/privacypolicy");

    msg.channel.stopTyping();
  }
};
