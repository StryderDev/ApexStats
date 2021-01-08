const axios = require("axios");
const WorldsEdgeDrops = require("../GameData/MapDrops/WorldsEdge.json");
const OlympusDrops = require("../GameData/MapDrops/Olympus.json");

module.exports = {
  name: "drop",
  description: "Picks a random place to drop based on the current in-game map.",
  execute(message) {
    axios
      .get("https://fn.alphaleagues.com/v1/apex/map/?next=1")
      .then((result) => {
        var map = result.data;
        var nextMap = map.next[0];

        function mapName(name) {
          var maps = [
            // Current list of in-game maps
            // "Kings Canyon",
            "World's Edge",
            "Olympus",
          ];

          if (name.includes("Olympus")) {
            var mapName = "Olympus";
          } else if (name.includes("World's")) {
            var mapName = "World's Edge";
          } else {
            var mapName = name;
          }

          if (maps.indexOf(mapName) != -1) {
            if (mapName == "World's Edge") {
              return WorldsEdgeDrops[
                Math.floor(Math.random() * WorldsEdgeDrops.length)
              ];
            }

            return OlympusDrops[
              Math.floor(Math.random() * OlympusDrops.length)
            ];
          } else {
            return "NoMapData";
          }
        }

        const dropMessage = `Drop in **${mapName(map.map)}** in ${map.map}.`;

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
