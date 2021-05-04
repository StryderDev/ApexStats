const {client, Discord} = require("../ApexStats.js");

client.on("message", (message) => {
  // If the bot is DM'd, send a message to the support server
  if (message.channel.type == "dm" && !message.author.bot) {
    message.reply(
      `Hey! Join the support server at ${process.env.SUPPORT_SERVER} to get support.\n\n*These DM's are not monitored.*`
    );
    return;
  }

  // If the message does not start with the prefix, ignore it
  if (message.author.bot) return;

  // Temporary logging for debugging
  client.guilds.cache
    .get("664717517666910220")
    .channels.cache.get("789275133344743434")
    .send(
      `Guild: ${message.guild.name}\nUser: ${message.member.displayName}\nMessage: ${message.content}`
    );
});
