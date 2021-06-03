const chalk = require("chalk");
const {Command} = require("discord.js-light-commando");
const {checkMsg} = require("../functions/checkMsg.js");
const guns = require("../../GameData/guns.json");

module.exports = class MapCommand extends Command {
  constructor(client) {
    super(client, {
      name: "loadout",
      group: "fun",
      memberName: "loadout",
      description: "Chooses a random loadout.",
      examples: ["loadout"],
    });
  }
  onError(error) {
    console.log(chalk`{red Error: ${error}}`);
  }
  run(msg) {
    if (checkMsg(msg) == 1) return;

    const gunOne = Math.floor(Math.random() * guns.length);
    const gunTwo = Math.floor(Math.random() * guns.length);

    msg.say(`Run the **${guns[gunOne]}** and the **${guns[gunTwo]}** this round.`);
  }
};
