const {client} = require("../ApexStats.js");
const chalk = require("chalk");
const {DateTime} = require("luxon");

// Top.GG API
const DBL = require("dblapi.js");

if (config.topGG == "0") {
  // Don't send data to TopGG
} else {
  const dbl = new DBL(config.topGG, client);
  dbl.on("posted", () => {
    console.log("Server count posted!");
  });
}

client.once("ready", () => {
  console.log(chalk`{yellow [${DateTime.local().toFormat("hh:mm:ss")}] Logging in...}`);
  console.log(
    chalk`{green [${DateTime.local().toFormat("hh:mm:ss")}] Logged in as ${client.user.tag}}`
  );
});
