const { client, Discord } = require("../ApexStats.js");
var { DateTime, Duration } = require("luxon");
const config = require("../config.json");
const axios = require("axios");

// Top.GG API
const DBL = require("dblapi.js");

if (config.topGG == "0") {
  console.log("Don't send data to Top.GG");
} else {
  const dbl = new DBL(config.topGG, client);
  dbl.on("posted", () => {
    console.log("Server count posted!");
  });
}

client.once("ready", () => {
  console.log(`Logging in as ${client.user.tag}`);

  function setPresence() {
    client.user
      .setPresence({
        activity: {
          name: `${config.prefix}commands | Providing data for ${client.guilds.cache.size} servers`,
          type: "WATCHING",
        },
        status: "online",
      })
      .catch(console.error);
  }

  // Set intitial bot presence on load, otherwise presence
  // will be empty until the next update
  setPresence();
  console.log(
    `[${DateTime.local().toFormat("hh:mm:ss")}] Updated presence for ${
      client.user.tag
    }`
  );

  // Update the bot presence every 30 minutes to update
  // the amount of servers the bot is in
  setInterval(function () {
    setPresence();
    console.log(
      `[${DateTime.local().toFormat("hh:mm:ss")}] Updated presence for ${
        client.user.tag
      }`
    );
  }, Math.max(1, 30 || 1) * 60 * 1000);

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

  // Update the bot presence every 30 minutes to update
  // the amount of servers the bot is in
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
