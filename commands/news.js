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
  name: "news",
  description: "The most recent news from Apex Legends blog.",
  execute(message, args) {
    message.channel.send("Retrieving latest article...").then(async (msg) => {
      mozambiqueClient
        .news()
        .then(function (result) {
          const news = new Discord.MessageEmbed()
            .setTitle(result[0].title)
            .setThumbnail(process.env.BOT_ICON)
            .setURL(result[0].link)
            .setDescription(
              `${result[0].short_desc}\n\n**[Link to Full Article](${result[0].link})**`
            )
            .setImage(result[0].img)
            .setFooter(process.env.CREATOR_NAME, process.env.CREATOR_LOGO)
            .setTimestamp();

          msg.delete();
          msg.channel.send(news);
        })
        .catch(function (e) {
          msg.delete();
          msg.channel.send(
            "Could not retreive latest article. Please try again later."
          );
          console.log(e);
        });
    });
  },
};
