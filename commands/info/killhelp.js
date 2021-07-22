const chalk = require("chalk");
const {Command} = require("discord.js-light-commando");
const {checkMsg} = require("../functions/checkMsg.js");
const {MessageEmbed} = require("discord.js-light");

module.exports = class MapCommand extends Command {
  constructor(client) {
    super(client, {
      name: "killhelp",
      group: "info",
      memberName: "killhelp",
      description: "Info about kill logging.",
      examples: ["who"],
    });
  }
  onError(error) {
    console.log(chalk`{red Error: ${error}}`);
  }
  run(msg) {
    if (checkMsg(msg) == 1) return;

    msg.channel.startTyping();

    const killEmbed = new MessageEmbed()
      .setTitle("Kill Logging")
      .setDescription(
        'We\'re only able to record kills from a certain legend if you have the "Kills" or "Arena Kills" tracker enabled on a legend.\n\nIn order to calculate your total kills, equip one of the two (or both!) trackers and run the command on each legend.'
      )
      .setImage("https://cdn.apexstats.dev/Examples/KillsExample.png");

    msg.say(killEmbed);

    msg.channel.stopTyping();
  }
};
