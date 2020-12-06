const { client, Discord } = require("../ApexStats.js");
require("dotenv").config();
const config = require("../config.json");
const fs = require("fs");
const moment = require("moment");
const percentagebar = require("percentagebar");

// Require Wrapper Library
const MozambiqueAPI = require("mozambique-api-wrapper");

// Create Client instance by passing in API key
let mozambiqueClient = new MozambiqueAPI(config.APIKey);

module.exports = {
  name: "stats",
  description: "Apex user stats.",
  execute(message, args) {
    let platform = args[0].toUpperCase();
    let player = args[1];

    message.channel.send("Fetching stats...").then(async (msg) => {
      mozambiqueClient
        .search({
          platform: platform,
          player: player,
        })
        .then(function (result) {
          var seasonBP = result.global.battlepass.history.season7;
          var currentSeason = "7";

          function getLegendBanner(legend) {
            var legends = [
              // Current list of legends that have banner images
              "Bangalore",
              "Bloodhound",
              "Caustic",
              "Crypto",
              "Gibraltar",
              "Horizon",
              "Lifeline",
              "Loba",
              "Mirage",
              "Octane",
              "Pathfinder",
              "Rampart",
              "Revenant",
              "Wattson",
              "Wraith",
            ];

            if (legends.indexOf(legend) != -1) {
              return `https://sdcore.dev/cdn/ApexStats/LegendBanners/${legend}.png`;
            } else {
              return `https://sdcore.dev/cdn/ApexStats/LegendBanners/NoBanner.png`;
            }
          }

          function getBPLevel() {
            if (seasonBP != -1) {
              return seasonBP;
            } else {
              return "0";
            }
          }

          function getAccountLevel() {
            if (result.global.level >= 500) {
              return 500;
            } else {
              return result.global.level;
            }
          }

          function hasAvatar() {
            if (result.global.avatar != "Not available") {
              return result.global.avatar;
            } else {
              return "https://sdcore.dev/cdn/ApexStats/Icon.png";
            }
          }

          const stats = new Discord.MessageEmbed()
            .setTitle(`Apex Legends Stats for ${result.global.name}`)
            .setThumbnail(hasAvatar())
            .setDescription("Description")
            .addField(
              `Account Level ${getAccountLevel()}/500`,
              `${percentagebar(500, getAccountLevel(), 10)}`,
              true
            )
            .addField(
              `Season ${currentSeason} Battlepass Level ${getBPLevel()}/110`,
              `${percentagebar(110, getBPLevel(), 10)}`,
              true
            )
            .setImage(getLegendBanner(result.legends.selected.LegendName))
            .setFooter(process.env.CREATOR_NAME, process.env.CREATOR_LOGO)
            .setTimestamp();

          msg.delete();
          message.reply(stats);
        })
        .catch(function (e) {
          msg.delete();
          message.reply("Error processing stats. Please try again.");
          console.log(e);
        });
    });
  },
};
