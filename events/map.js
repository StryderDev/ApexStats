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
        var currentTimestamp = Math.floor(DateTime.local().toFormat("X") / 2);

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
