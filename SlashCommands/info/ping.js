const { CommandInteraction, Client } = require("discord.js");

module.exports = {
  name: "ping",
  description: "ping command",
  run: async (client, interaction, args) => {
    interaction.editReply({ embed: "Hi!" });
  },
};
