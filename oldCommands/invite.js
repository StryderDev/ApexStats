module.exports = {
  name: "invite",
  description: "Invite the bot to your server.",
  execute(message) {
    message.channel.send(
      "Invite the bot to your server: <https://apexstats.dev/invite>"
    );
  },
};
