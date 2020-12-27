const { client, Discord } = require("../ApexStats.js");
const config = require("../config.json");
const fs = require("fs");

client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`../commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("message", (message) => {
  if (message.channel.type == "dm" && !message.author.bot) {
    message.reply(
      `Hey! Join the support server at ${process.env.SUPPORT_SERVER} to get support.\n\n*These DM's are not monitored.*`
    );
    return;
  }

  // If the message does not start with the prefix, ignore it
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  // Temporary logging for debugging
  client.guilds.cache
    .get("664717517666910220")
    .channels.cache.get("789275133344743434")
    .send(
      `Guild: ${message.guild.name}\nUser: ${message.member.displayName}\nMessage: ${message.content}`
    );

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName))
    return message.reply("that's not a valid command.");
  const command = client.commands.get(commandName);

  try {
    command.execute(message, args);
  } catch (error) {
    console.log(error);
    message.reply("there was an issue running that command.");
  }
});
