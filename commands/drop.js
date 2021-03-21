const axios = require("axios");
const WorldsEdgeDrops = require("../GameData/MapDrops/WorldsEdge.json");
const OlympusDrops = require("../GameData/MapDrops/Olympus.json");
const KingsCanyonDrops = require("../GameData/MapDrops/KingsCanyon.json");

module.exports = {
  name: "drop",
  description: "Picks a random place to drop based on the current in-game map.",
  execute(message, args) {
    axios
      .get("https://fn.alphaleagues.com/v1/apex/map/")
      .then((result) => {
        var map = result.data;

        function dropLocation(name) {
          if (args[0]) {
            var manualMaps = ["KC", "WE", "OLYMPUS"];
            var mapArg = args[0].toUpperCase();

            if (manualMaps.indexOf(mapArg) != -1) {
              if (mapArg == "WE") {
                return `Drop in **${
                  WorldsEdgeDrops[Math.floor(Math.random() * WorldsEdgeDrops.length)]
                }** on World's Edge.`;
              } else if (mapArg == "KC") {
                return `Drop in **${
                  KingsCanyonDrops[Math.floor(Math.random() * KingsCanyonDrops.length)]
                }** on Kings Canyon.`;
              } else if (mapArg == "OLYMPUS") {
                return `Drop in **${
                  OlympusDrops[Math.floor(Math.random() * OlympusDrops.length)]
                }** on Olympus.`;
              }
            }
          } else {
            var maps = ["Kings Canyon", "World's Edge", "Olympus"];

            if (name.includes("Olympus")) {
              var mapName = "Olympus";
            } else if (name.includes("World's")) {
              var mapName = "World's Edge";
            } else if (name.includes("Kings") || name.includes("King's")) {
              var mapName = "Kings Canyon";
            } else {
              var mapName = name;
            }

            if (maps.indexOf(mapName) != -1) {
              if (mapName == "World's Edge") {
                return `Drop in **${
                  WorldsEdgeDrops[Math.floor(Math.random() * WorldsEdgeDrops.length)]
                }** on World's Edge.`;
              } else if (mapName == "Kings Canyon") {
                return `Drop in **${
                  KingsCanyonDrops[Math.floor(Math.random() * KingsCanyonDrops.length)]
                }** on Kings Canyon.`;
              } else if (mapName == "Olympus") {
                return `Drop in **${
                  OlympusDrops[Math.floor(Math.random() * OlympusDrops.length)]
                }** on Olympus.`;
              }
            } else {
              return "NoMapData";
            }
          }
        }

        function getMapName(name) {
          if (name.includes("Olympus")) {
            return (mapName = "Olympus");
          } else if (name.includes("World's")) {
            return (mapName = "World's Edge");
          } else if (name.includes("Kings") || name.includes("King's")) {
            return (mapName = "Kings Canyon");
          } else {
            return (mapName = name);
          }
        }

        const dropMessage = dropLocation(map.map);

        message.channel.send(dropMessage);
      })
      .catch((err) => {
        message.channel.send(
          "Could not retreive in-game map rotation schedule to determine a drop location. Please try again later."
        );
        console.log(err);
      });
  },
};
