require("dotenv").config;

const config = require("./config.json");

// Just using the ShardManager now so I don't have
// to worry about it in the future. Will probably regret
// it if I don't plan on making the bot public, but as
// it stands right now, I do. Guess we'll see ;)

const { ShardingManager } = require("discord.js-light");
const manager = new ShardingManager("./ApexStats.js", {
  token: config.token,
});

manager.on("shardCreate", (shard) =>
  console.log(`Launched Shard ID ${shard.id}`)
);
manager.spawn();
