const {client, Discord} = require("../ApexStats.js");
const config = require("../config.json");
const fs = require("fs");

//client.commands = new Discord.Collection();

//const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));

//for (const file of commandFiles) {
//  const command = require(`../commands/${file}`);
//  client.commands.set(command.name, command);
//}

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

  //const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  //const commandName = args.shift().toLowerCase();

  //if (!client.commands.has(commandName)) return console.log("User did not run a valid command.");
  //const command = client.commands.get(commandName);

  // If server command is sent in is the Apex server
  //if (message.guild.id == "541484311354933258") {
  // If channel command is sent in is #use-bots-here
  //if (message.channel.id == "632283707482308608") {
  //try {
  //command.execute(message, args);
  //} catch (error) {
  //return console.log(`Error: ${error}`);
  //}
  //} else if (
  //message.member.roles.cache.some((role) => role.name === "Discord Moderator") ||
  //message.member.roles.cache.some((role) => role.name === "Admin")
  //) {
  // User has Discord Moderator or Admin roles and can send a message
  //try {
  //command.execute(message, args);
  //} catch (error) {
  //return console.log(`Error: ${error}`);
  //}
  //} else {
  // Outside of inteded channel in server
  //return console.log("User is not allowed to do that command here.");
  //}
  //} else {
  // Just a normal server, ignore the above
  //try {
  //command.execute(message, args);
  //} catch (error) {
  //return console.log(`Error: ${error}`);
  //}
  //}
});
