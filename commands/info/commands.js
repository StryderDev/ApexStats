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

    msg.channel.startTyping();

    const embed = new MessageEmbed()
      .setTitle("Bot Commands")
      .addField("Fun", ">>drop\n>>who", true)
      .addField("Misc.", ">>invite\n>>privacypolicy", true)
      .addField("Utility", ">>arenas\n>>map\n>>status", true)
      .addField("Info", ">>changelog\n>>commands\n>>event\n>>info", true)
      .addField(`\u200b`, ">>legend\n>>news\n>>season\n>>stats", true);

    msg.say(embed);

    msg.channel.stopTyping();
  }
};
