require("dotenv").config();

const { client, Discord } = require("../ApexStats.js");
const config = require("../config.json");

module.exports = {
  name: "shards",
  description: "Shows shard info about the bot.",
  execute(message) {
    var user = `${message.author.username}#${message.author.discriminator}`;

    if (user != "SDCore#1234") {
      console.log("User cannot perform this action.");
    } else {
      const promises = [
        client.shard.fetchClientValues("guilds.cache.size"),
        client.shard.broadcastEval(
          "this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)"
        ),
      ];

      Promise.all(promises)
        .then((results) => {
          const totalGuilds = results[0].reduce(
            (acc, guildCount) => acc + guildCount,
            0
          );
          const totalMembers = results[1].reduce(
            (acc, memberCount) => acc + memberCount,
            0
          );
          return message.channel.send(
            `**Shard Count:** ${client.shard.count}\n**Server Count:** ${totalGuilds}\n**Member Count:** ${totalMembers}\n**Guild Shard ID:** ${message.guild.shardID}`
          );
        })
        .catch(console.error);
    }
  },
};
