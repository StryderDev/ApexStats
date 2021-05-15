const {client} = require("../ApexStats.js");
const chalk = require("chalk");
const {DateTime} = require("luxon");
const config = require("../config.json");

// Top.GG API
const AutoPoster = require("topgg-autoposter");

if (config.topGG == "0") {
  // Don't send data to TopGG
} else {
  const ap = new AutoPoster(config.topGG, client);
  ap.on("posted", () => {
    console.log("Server count posted!");
  });
}

client.once("ready", () => {
  console.log(chalk`{yellow [${DateTime.local().toFormat("hh:mm:ss")}] Logging in...}`);
  console.log(
    chalk`{green [${DateTime.local().toFormat("hh:mm:ss")}] Logged in as ${client.user.tag}}`
  );
});
