const { Discord } = require("../ApexStats.js");

module.exports = {
  name: "sm",
  description:
    "Creates a message for use in auto-updating embeds. Only useable by SDCore.",
  execute(message) {
    var user = `${message.author.username}#${message.author.discriminator}`;

    if (user != "SDCore#1234") {
      console.log("User cannot perform this action.");
    } else {
      const placeholderEmbed = new Discord.MessageEmbed()
        .setTitle("Placeholder Embed")
        .setDescription(
          "This is a placeholder embed, and will be replaced when the module is set up."
        );

      message.channel.send(placeholderEmbed);
    }
  },
};
