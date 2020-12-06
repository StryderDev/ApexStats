const { client } = require("../ApexStats.js");
const moment = require("moment");

client.once("ready", () => {
  console.log(`Logging in as ${client.user.tag}`);

  function setPresence() {
    client.user
      .setPresence({
        activity: {
          name: `>help | Providing data for ${client.guilds.cache.size} servers`,
          type: "WATCHING",
        },
        status: "online",
      })
      .catch(console.error);
  }

  setPresence();
  console.log(
    `[${moment().format("hh:mm:ss")}] Updated presence for ${client.user.tag}`
  );
});
