const chalk = require("chalk");
const {Command} = require("discord.js-light-commando");
const {checkMsg} = require("../functions/checkMsg.js");
const WorldsEdgeDrops = require("../../GameData/MapDrops/WorldsEdge.json");
const OlympusDrops = require("../../GameData/MapDrops/Olympus.json");
const KingsCanyonDrops = require("../../GameData/MapDrops/KingsCanyon.json");
const {default: axios} = require("axios");

module.exports = class MapCommand extends Command {
  constructor(client) {
    super(client, {
      name: "drop",
      group: "fun",
      memberName: "drop",
      description: "Chooses a random location to drop at.",
      examples: ["drop"],
      args: [
        {
          key: "map",
          prompt: "Which map you want to select from: KC, WE, or Olympus.",
          type: "string",
          default: "",
        },
      ],
    });
  }
  onError(error) {
    console.log(chalk`{red Error: ${error}}`);
  }
  run(msg, {map}) {
    if (checkMsg(msg) == 1) return;

    function getMap(mapName) {
      if (mapName == "Kings Canyon")
        return `Drop in **${
          KingsCanyonDrops[Math.floor(Math.random() * KingsCanyonDrops.length)]
        }** on Kings Canyon.`;

      if (mapName == "World's Edge")
        return `Drop in **${
          WorldsEdgeDrops[Math.floor(Math.random() * WorldsEdgeDrops.length)]
        }** on World's Edge.`;

      if (mapName == "Olympus")
        return `Drop in **${
          OlympusDrops[Math.floor(Math.random() * OlympusDrops.length)]
        }** on Olympus.`;
    }

    if (!map) {
      axios
        .get("https://fn.alphaleagues.com/v1/apex/map/")
        .then((result) => {
          var map = result.data.map;

          msg.say(getMap(map));
        })
        .catch((err) => {
          console.log(chalk`{red Error: ${err}}`);
          msg.say(
            "Could not get in-game map rotation schedule. Please drop `>>drop kc`, `>>drop we`, or `>>drop olympus` for map specific drops."
          );
        });
    }

    // Get map from args
    var map = map.toUpperCase();
    var mapList = ["KC", "WE", "OLYMPUS"];

    if (mapList.indexOf(map) != -1) {
      if (map == "KC") msg.say(getMap("Kings Canyon"));
      if (map == "WE") msg.say(getMap("World's Edge"));
      if (map == "OLYMPUS") msg.say(getMap("Olympus"));
    }
  }
};
