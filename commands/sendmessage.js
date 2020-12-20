const { client, Discord } = require("../ApexStats.js");
require("dotenv").config();
const config = require("../config.json");

module.exports = {
  name: "sendmessage",
  description: "Create messages for use in map rotation info.",
  execute(message, args) {
    if (message.author.username != "SDCore") {
      console.log("User cannot perform this action.");
    } else {
      const placeholder = new Discord.MessageEmbed()
        .setTitle("Placeholder Embed")
        .setDescription(
          "This a placeholder embed, and will be replaced with the map rotation embed once it has been setup."
        );
      message.channel.send(placeholder);
    }
  },
};
