const {exists} = require("fs");
const {exit} = require("process");

function checkMsg(msg) {
  // If the server is the apex server
  if (msg.guild.id == "835268919174365275") {
    // Check if user is a discord mod or admin
    if (
      msg.member.roles.cache.some((role) => role.name === "Discord Moderator") ||
      msg.member.roles.cache.some((role) => role.name === "Admin")
    ) {
      console.log(`+(A)[${msg.guild.name}][#${msg.channel.name}] ${msg.content}`);
      return 0;
    }

    // If user is not discord mod or admin, check
    // to see if the channel is #use-bots-here
    if (msg.channel.id == "835268919668768791") {
      console.log(`+(A)[${msg.guild.name}][#${msg.channel.name}] ${msg.content}`);
      return 0;
    }

    // User isn't allowed to use the bot
    console.log(`-(A)[${msg.guild.name}][#${msg.channel.name}] ${msg.content}`);
    return 1;
  }

  // Server is not the apex server, run command
  console.log(`+[${msg.guild.name}][#${msg.channel.name}] ${msg.content}`);
  return 0;
}

module.exports = {checkMsg};
