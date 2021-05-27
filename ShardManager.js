require("dotenv").config;

const config = require("./config.json");

// TopGG API
const {AutoPoster} = require("topgg-autoposter");

const {ShardingManager} = require("discord.js-light");
const manager = new ShardingManager("./ApexStats.js", {
  token: config.token,
  totalShards: config.shards,
});

if (config.topGG == "0") {
  // Do nothing
} else {
  const ap = AutoPoster(config.topGG, manager);
  // optional
  ap.on("posted", () => {
    // ran when succesfully posted
    console.log("Posted stats to top.gg");
  });
}

manager.on("shardCreate", (shard) => {
  console.log(`- Spawned shard ${shard.id} -`);
  shard.on("ready", () => {
    console.log(`Shard ${shard.id} connected to Discord's Gateway.`);
    // Sending the data to the shard.
    shard.send({type: "shardId", data: {shardId: shard.id}});
  });
});

manager.spawn();
