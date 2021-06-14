const chalk = require("chalk");
const {Command} = require("discord.js-light-commando");
const {checkMsg} = require("../functions/checkMsg.js");
const legends = require("../../GameData/legends.json");

module.exports = class MapCommand extends Command {
  constructor(client) {
    super(client, {
      name: "who",
      group: "fun",
      memberName: "who",
      description: "Chooses a random legend to play.",
      examples: ["who"],
    });
  }
  onError(error) {
    console.log(chalk`{red Error: ${error}}`);
  }
  run(msg) {
    if (checkMsg(msg) == 1) return;

    const legendIDs = [
      "898565421",
      "182221730",
      "1409694078",
      "1464849662",
      "827049897",
      "725342087",
      "1111853120",
      "2045656322",
      "843405508",
      "187386164",
      "80232848",
      "64207844",
      "1579967516",
      "2105222312",
      "88599337",
      "405279270",
      "435256162",
    ];

    const randomLegend = Math.floor(Math.random() * legendIDs.length);

    var legendName = legends[legendIDs[randomLegend]].Name;
    var legendEmoteID = legends[legendIDs[randomLegend]].EmoteID;
    var legendEmote = `<:${legendName}:${legendEmoteID}>`;

    msg.say(`${legendEmote} ${legendName}`);
  }
};
