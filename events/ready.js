const { client } = require("../ApexStats.js");
var { DateTime } = require("luxon");
const config = require("../config.json");

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

  setPresence();
  console.log(
    `[${DateTime.local().toFormat("hh:mm:ss")}] Updated presence for ${
      client.user.tag
    }`
  );
});
