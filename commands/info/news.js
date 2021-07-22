const chalk = require("chalk");
const {Command} = require("discord.js-light-commando");
const {checkMsg} = require("../functions/checkMsg.js");
const {MessageEmbed} = require("discord.js-light");
const config = require("../../config.json");

// Mozambique Wrapper Library
const MozambiqueAPI = require("mozambique-api-wrapper");
let mozambiqueClient = new MozambiqueAPI(config.MozambiqueAPI);

module.exports = class MapCommand extends Command {
  constructor(client) {
    super(client, {
      name: "news",
      group: "info",
      memberName: "news",
      description: "Gets the latest blog post from the official Apex Legends blog.",
      examples: ["news"],
    });
  }
  onError(error) {
    console.log(chalk`{red Error: ${error}}`);
  }
  run(msg) {
    if (checkMsg(msg) == 1) return;

    msg.say("Retrieving latest news article...").then(async (msg) => {
      mozambiqueClient
        .news()
        .then(function (result) {
          msg.channel.startTyping();

          const news = result[0];

          const newsEmbed = new MessageEmbed()
            .setTitle(news.title)
            .setDescription(`${news.short_desc}\n\n[Link to full article](${news.link})`)
            .setImage(news.img)
            .setFooter("Data provided by https://apexlegendsapi.com/");

          msg.delete();
          msg.say(newsEmbed);

          msg.channel.stopTyping();
        })
        .catch(function (err) {
          msg.delete();
          msg.say("Could not retreive the latest article. Please try again later.");
          console.log(chalk`{red Error: ${err}}`);
        });

      msg.channel.stopTyping();
    });
  }
};
