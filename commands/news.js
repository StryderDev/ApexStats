const { Discord } = require("../ApexStats.js");
const config = require("../config.json");

// Mozambique Wrapper Library
const MozambiqueAPI = require("mozambique-api-wrapper");
let mozambiqueClient = new MozambiqueAPI(config.MozambiqueAPI);

module.exports = {
  name: "news",
  description:
    "The most recent news article from the official Apex Legends blog.",
  execute(message) {
    message.channel.send("Retrieving latest article...").then(async (msg) => {
      mozambiqueClient
        .news()
        .then(function (result) {
          const news = result[0];

          const newsEmbed = new Discord.MessageEmbed()
            .setTitle(news.title)
            .setColor("C21D27")
            .setURL(news.link)
            .setDescription(
              `${news.short_desc}\n\n**[Link to full article](${news.link})**`
            )
            .setImage(news.img)
            .setFooter("Data provided by https://apexlegendsapi.com");

          msg.delete();
          msg.channel.send(newsEmbed);
        })
        .catch(function (err) {
          msg.delete();
          msg.channel.send(
            "Could not retreive the latest article. Please try again later."
          );
          console.log(err);
        });
    });
  },
};
