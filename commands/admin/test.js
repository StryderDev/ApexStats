const chalk = require("chalk");
const {MessageEmbed} = require("discord.js-light");
const {Command} = require("discord.js-light-commando");
const {checkMsg} = require("../functions/checkMsg.js");

module.exports = class MapCommand extends Command {
  constructor(client) {
    super(client, {
      name: "test",
      group: "admin",
      description: "N/A. Only usable by bot owner. (for testing purposes)",
      examples: ["test"],
      memberName: "connor!",
    });
  }
  onError(error) {
    console.log(chalk`{red Error: ${error}}`);
  }
  run(msg) {
    if (checkMsg(msg) == 1) return;
    const embed = new MessageEmbed().setTitle("page 1").setColor(0xff0000);

    const embed2 = new MessageEmbed().setTitle("page 2").setColor(0xff0000);

    const embed3 = new MessageEmbed().setTitle("page 3").setColor(0xff0000);

    const embed4 = new MessageEmbed().setTitle("page 4").setColor(0xff0000);

    const embed5 = new MessageEmbed().setTitle("page 5").setColor(0xff0000);
    msg.channel.createSlider(msg.author.id, [embed, embed2, embed3, embed4, embed5], "➡", "⬅");
  }
};
