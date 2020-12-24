const { client, Discord } = require("../ApexStats.js");
var { DateTime } = require("luxon");
const config = require("../config.json");
const axios = require("axios");

client.once("ready", () => {
  // ----- APEX MAP ROTATION UPDATE ----- //
  function updateMapRotation() {
    axios
      .get("https://fn.alphaleagues.com/v1/apex/map/")
      .then((res) => {
        function mapImage(name) {
          if (name == "Olympus") {
            return `Olympus.png?q=${DateTime.local().toFormat("X")}`;
          } else if (name == "World's Edge") {
            return `WorldsEdge.png?q=${DateTime.local().toFormat("X")}`;
          } else {
            return `NoMapData.png?q=${DateTime.local().toFormat("X")}`;
          }
        }

        function nextMap(name) {
          if (name == "Olympus") {
            return "World's Edge";
          } else if (name == "World's Edge") {
            return "Olympus";
          }
        }

        function time(seconds) {
          return DateTime.local()
            .plus({ seconds: seconds })
            .toRelative({ style: "long" });
        }

        const mapRotation = new Discord.MessageEmbed()
          .setDescription(
            `The current map is **${
              res.data.map
            }**.\nThe next map in rotation is **${nextMap(res.data.map)} ${time(
              res.data.times.remaining.seconds
            )}.**`
          )
          .setImage(
            `https://sdcore.dev/cdn/ApexStats/Maps/${mapImage(res.data.map)}`
          )
          .setTimestamp();

        const guild = client.guilds.cache.get(config.mapRotation.guildID);
        if (!guild) return console.log("Unable to find guild.");

        const channel = guild.channels.cache.find(
          (c) => c.id === config.mapRotation.channelID && c.type === "text"
        );
        if (!channel) return console.log("Unable to find channel.");

        try {
          const message = channel.messages.fetch(config.mapRotation.messageID);
          if (!message) return console.log("Unable to find message.");

          channel.messages.fetch(config.mapRotation.messageID).then((mesg) => {
            mesg.edit(mapRotation);
          });
        } catch (err) {
          console.error(err);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  updateMapRotation();
  console.log(
    `[${DateTime.local().toFormat("hh:mm:ss")}] Updated Map Rotation Embed`
  );

  setInterval(function () {
    var date = new Date();

    console.log("Checking update interval...");

    if (date.getMinutes() % config.mapRotation.updateInterval == 0) {
      updateMapRotation();
      console.log(
        `[${DateTime.local().toFormat("hh:mm:ss")}] Updated Map Rotation Embed`
      );
    }
  }, Math.max(1, 1 || 1) * 60 * 1000);
});
