const { client } = require("../ApexStats.js");
var { DateTime } = require("luxon");
const config = require("../config.json");

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
  console.log(`Logging in as ${client.user.tag}`);

  function setPresence() {
    client.user
      .setPresence({
        activity: {
          name: `${config.prefix}commands | Providing data for ${client.guilds.cache.size} servers`,
          type: "WATCHING",
        },
        status: "online",
      })
      .catch(console.error);
  }

  // Set intitial bot presence on load, otherwise presence
  // will be empty until the next update
  setPresence();
  console.log(
    `[${DateTime.local().toFormat("hh:mm:ss")}] Updated presence for ${
      client.user.tag
    }`
  );

  // Update the bot presence every 30 minutes to update
  // the amount of servers the bot is in
  setInterval(function () {
    setPresence();
    console.log(
      `[${DateTime.local().toFormat("hh:mm:ss")}] Updated presence for ${
        client.user.tag
      }`
    );
  }, Math.max(1, 30 || 1) * 60 * 1000);
});
