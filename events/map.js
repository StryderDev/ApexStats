const { client, Discord } = require("../ApexStats.js");
var { DateTime } = require("luxon");
const config = require("../config.json");
const axios = require("axios");

client.once("ready", () => {
  // ----- APEX MAP ROTATION UPDATE ----- //
  function updateMapRotation() {
    axios
      .get("https://fn.alphaleagues.com/v1/apex/map/?next=1")
      .then((result) => {
        var map = result.data;
        var nextMap = map.next[0];
        var currentTimestamp = Math.floor(DateTime.local().toFormat("ooo"));

        function mapImage(name) {
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
              return "WorldsEdge";
            }

            return mapName;
          } else {
            return "NoMapData";
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

          return `${finalTime.hours} hour(s), ${finalTime.minutes} minute(s)`;
        }

        const mapEmbed = new Discord.MessageEmbed()
          .setDescription(
            `The current map is **${map.map}**.\nThe next map is **${
              nextMap.map
            }** in **${time(
              map.times.remaining.seconds
            )}** which will last for **${nextMap.duration} minutes**.`
          )
          .setImage(
            `https://sdcore.dev/cdn/ApexStats/Maps/${mapImage(
              map.map
            )}.png?q=${currentTimestamp}`
          )
          .setTimestamp();

        const guild = client.guilds.cache.get(config.autoUpdate.guildID);
        if (!guild) return console.log("Unable to find guild.");

        const channel = guild.channels.cache.find(
          (c) => c.id === config.autoUpdate.map.channel && c.type === "text"
        );
        if (!channel) return console.log("Unable to find channel.");

        try {
          const message = channel.messages.fetch(config.autoUpdate.map.message);
          if (!message) return console.log("Unable to find message.");

          channel.messages.fetch(config.autoUpdate.map.message).then((msg) => {
            msg.edit(mapEmbed);
          });
        } catch (err) {
          console.error(`Other Error: ${err}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (config.autoUpdate.map.enabled == "true") {
    updateMapRotation();
    console.log(
      `[${DateTime.local().toFormat("hh:mm:ss")}] Updated Map Rotation Embed`
    );
  }

  setInterval(function () {
    if (config.autoUpdate.map.enabled == "true") {
      var date = new Date();

      if (date.getMinutes() % config.autoUpdate.map.interval == 0) {
        updateMapRotation();
        console.log(
          `[${DateTime.local().toFormat(
            "hh:mm:ss"
          )}] Updated Map Rotation Embed`
        );
      }
    }
  }, Math.max(1, 1 || 1) * 60 * 1000);
});
