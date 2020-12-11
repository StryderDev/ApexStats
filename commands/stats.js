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
    let platformArg = args[0];
    let player = args[1];

    if (platformArg != null && player != null) {
      var platform = platformArg.toUpperCase();
    }

    message.channel.send("Fetching stats...").then(async (msg) => {
      mozambiqueClient
        .search({
          platform: platform,
          player: player,
        })
        .then(function (result) {
          if (platform != null && player != null) {
            if (platform == "PC" || platform == "PS4" || platform == "X1") {
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
                  return `https://sdcore.dev/cdn/ApexStats/LegendBanners/${legend}.png?q=${moment().valueOf()}`;
                } else {
                  return `https://sdcore.dev/cdn/ApexStats/LegendBanners/NoBanner.png?q=${moment().valueOf()}`;
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
                .setTitle(
                  `Apex Legends Stats for ${result.global.name} on ${platform}`
                )
                .setColor("C21D27")
                .setThumbnail(hasAvatar())
                .setDescription("Description")
                .addField(
                  `Account Level ${getAccountLevel()}/500`,
                  `${percentagebar(500, getAccountLevel(), 10)}`,
                  true
                )
                .addField(
                  `S${currentSeason} BP Level ${getBPLevel()}/110`,
                  `${percentagebar(110, getBPLevel(), 10)}`,
                  true
                )
                .setImage(getLegendBanner(result.legends.selected.LegendName))
                .setFooter(process.env.CREATOR_NAME, process.env.CREATOR_LOGO)
                .setTimestamp();

              msg.delete();
              message.reply(stats);
            } else {
              msg.delete();
              message.reply(
                "Sorry, it looks like you didn't provide a valid platform.\nFor reference, PC = Origin/Steam, X1 = Xbox, and PS4 = Playstation Network."
              );
            }
          }
        })
        .catch(function (e) {
          if (platform == null && player == null) {
            msg.delete();
            message.channel.send(
              `To use this command, use the following format:\n\`${config.prefix}stats [platform] [username]\``
            );
            return;
          }
          msg.delete();
          message.channel.send(
            "Uncaught error processing stats. Please try again or contact a mod if the problem persists."
          );
          console.log(e);
        });
    });
  },
};
