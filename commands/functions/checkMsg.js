const chalk = require("chalk");
const config = require("../../config.json");

function checkMsg(msg) {
  // If the server is the apex server
  if (msg.guild.id == config.checkMessage.guildID) {
    // Check if user is a discord mod or admin
    if (
      msg.member.roles.cache.some((role) => role.name === "Discord Moderator") ||
      msg.member.roles.cache.some((role) => role.name === "Admin")
    ) {
      console.log(
        chalk`{blue.bold [A/DM]}{green.bold +(A)[${msg.guild.name}][#${msg.channel.name}]} ${msg.content}`
      );
      return 0;
    }

    // If user is not discord mod or admin, check
    // to see if the channel is #use-bots-here
    if (msg.channel.id == config.checkMessage.channelID) {
      console.log(chalk`{green.bold +(A)[${msg.guild.name}][#${msg.channel.name}]} ${msg.content}`);
      return 0;
    }

    // User isn't allowed to use the bot
    console.log(chalk`{red.bold -(A)[${msg.guild.name}][#${msg.channel.name}]} ${msg.content}`);
    return 1;
  }

  // Server is not the apex server, run command
  console.log(chalk`{white.bold +[${msg.guild.name}][#${msg.channel.name}]} ${msg.content}`);
  return 0;
}

module.exports = {checkMsg};
