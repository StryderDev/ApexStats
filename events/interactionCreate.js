const client = require("../Apex.js");

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    await interaction
      .reply({ content: "Loading...", ephemeral: false })
      .catch(() => {});

    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd)
      return interaction.followUp({
        content: "An error has occured with that command.",
      });

    cmd.run(client, interaction);
  }
});
