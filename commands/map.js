const { Discord } = require("../ApexStats.js");
const axios = require("axios");

var { DateTime } = require("luxon");

module.exports = {
  name: "map",
  description: "Shows the current and next in-game map in rotation.",
  execute(message, args) {
    if (!args) {
      var mapURL = "https://fn.alphaleagues.com/v1/apex/map/?next=1";
    } else {
      if (isNaN(args[0])) {
        var mapURL = "https://fn.alphaleagues.com/v1/apex/map/?next=1";
      } else if (args[0] >= 10) {
        var mapURL = "https://fn.alphaleagues.com/v1/apex/map/?next=10";
      } else if (args[0] <= 1) {
        var mapURL = "https://fn.alphaleagues.com/v1/apex/map/?next=1";
      } else {
        var mapURL = `https://fn.alphaleagues.com/v1/apex/map/?next=${args[0]}`;
      }
    }

    message.channel
      .send("Getting current in-game map rotation schedule...")
      .then(async (msg) => {
        axios
          .get(mapURL)
          .then((result) => {
            var map = result.data;
            var nextMap = map.next[0];
            var currentTimestamp = Math.floor(DateTime.local().toFormat("ooo"));

            function mapImage(name) {
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
                  return "Season%208/WorldsEdge";
                } else if (
                  mapName == "Kings Canyon" ||
                  mapName == "King's Canyon"
                ) {
                  return "Season%208/KingsCanyon";
                } else if (mapName == "Olympus") {
                  return "Season%208/Olympus";
                }

                return mapName;
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

            function time(seconds) {
              var currentDate = DateTime.local();
              var futureDate = DateTime.local().plus({
                seconds: seconds,
              });

              var timeTill = futureDate.diff(currentDate, [
                "hours",
                "minutes",
                "seconds",
              ]);

              var finalTime = timeTill.toObject();

              const pluralize = (count, noun, suffix = "s") =>
                `${count} ${noun}${count !== 1 ? suffix : ""}`;

              return `${pluralize(finalTime.hours, "hour")}, ${pluralize(
                finalTime.minutes,
                "minute"
              )}`;
            }

            const mapEmbed = new Discord.MessageEmbed()
              .setDescription(
                `The current map is **${getMapName(
                  map.map
                )}**.\nThe next map is **${nextMap.map}** in **${time(
                  map.times.remaining.seconds
                )}** which will last for **${nextMap.duration} minutes**.`
              )
              .setImage(
                `https://cdn.apexstats.dev/Maps/${mapImage(
                  map.map
                )}.png?q=${currentTimestamp}`
              )
              .setFooter("Provided by https://rexx.live");

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
