const { Discord } = require("../ApexStats.js");
const axios = require("axios");

var { DateTime } = require("luxon");

module.exports = {
  name: "map",
  description: "Shows the current and next in-game map in rotation.",
  execute(message) {
    message.channel
      .send("Getting current in-game map rotation schedule...")
      .then(async (msg) => {
        axios
          .get("https://fn.alphaleagues.com/v1/apex/map/?next=1")
          .then((result) => {
            var map = result.data;
            var nextMap = map.next[0];
            var currentTimestamp = Math.floor(
              DateTime.local().toFormat("X") / 2
            );

            function mapImage(name) {
              var maps = [
                // Current list of in-game maps
                // "Kings Canyon",
                "World's Edge",
                "Olympus",
              ];

              if (maps.indexOf(name) != -1) {
                if (name == "World's Edge") {
                  return "WorldsEdge";
                }

                return name;
              } else {
                return "NoMapData";
              }
            }

            function time(seconds) {
              return DateTime.local()
                .plus({ seconds: seconds })
                .toRelative({ style: "long" });
            }

            const mapEmbed = new Discord.MessageEmbed()
              .setDescription(
                `The current map is **${
                  map.map
                }**.\nThe next map in rotation is **${nextMap.map} ${time(
                  map.times.remaining.seconds
                )}** for a length of **${nextMap.duration} minutes**.`
              )
              .setImage(
                `https://sdcore.dev/cdn/ApexStats/Maps/${mapImage(
                  map.map
                )}.png?q=${currentTimestamp}`
              );

            msg.delete();
            msg.channel.send(mapEmbed);
          })
          .catch((err) => {
            msg.delete();
            msg.channel.send(
              "Could not retreive in-game map rotation schedule. Please try again later."
            );
            console.log(err);
          });
      });
  },
};
