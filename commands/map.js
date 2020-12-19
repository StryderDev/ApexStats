const { client, Discord } = require("../ApexStats.js");
require("dotenv").config();
const axios = require("axios");
var { DateTime, Duration } = require("luxon");

module.exports = {
  name: "map",
  description: "Shows current map rotation.",
  execute(message, args) {
    message.channel
      .send("Getting current map rotation schedule...")
      .then(async (msg) => {
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
              return Duration.fromObject({ seconds: seconds }).toFormat(
                "mm 'minutes' ss 'seconds'"
              );
            }

            const map = new Discord.MessageEmbed()
              .setDescription(
                `The current map is **${
                  res.data.map
                }**.\nThe next map in rotation is **${nextMap(
                  res.data.map
                )}** in **${time(res.data.times.remaining.seconds)}.**`
              )
              .setImage(
                `https://sdcore.dev/cdn/ApexStats/Maps/${mapImage(
                  res.data.map
                )}`
              );

            msg.delete();
            msg.channel.send(map);
          })
          .catch((err) => {
            console.log(err);
          });
      });
  },
};
