const axios = require("axios");
const WorldsEdgeDrops = require("../GameData/MapDrops/WorldsEdge.json");
const OlympusDrops = require("../GameData/MapDrops/Olympus.json");
const KingsCanyonDrops = require("../GameData/MapDrops/KingsCanyon.json");

module.exports = {
  name: "drop",
  description: "Picks a random place to drop based on the current in-game map.",
  execute(message) {
    axios
      .get("https://fn.alphaleagues.com/v1/apex/map/")
      .then((result) => {
        var map = result.data;

        function dropLocation(name) {
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
              return WorldsEdgeDrops[
                Math.floor(Math.random() * WorldsEdgeDrops.length)
              ];
            } else if (mapName == "Kings Canyon") {
              return KingsCanyonDrops[
                Math.floor(Math.random() * KingsCanyonDrops.length)
              ];
            } else if (mapName == "Olympus") {
              return OlympusDrops[
                Math.floor(Math.random() * OlympusDrops.length)
              ];
            }
          } else {
            return "NoMapData";
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

        const dropMessage = `Drop in **${dropLocation(
          map.map
        )}** on ${getMapName(map.map)}.`;

        message.channel.send(dropMessage);
      })
      .catch((err) => {
        msg.channel.send(
          "Could not retreive in-game map rotation schedule to determine a drop location. Please try again later."
        );
        console.log(err);
      });
  },
};
