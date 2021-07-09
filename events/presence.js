const {client} = require("../ApexStats.js");
const chalk = require("chalk");
const {DateTime} = require("luxon");
const axios = require("axios");
const config = require("../config.json");

client.once("ready", () => {
  function setPresence() {
    let BR = "https://fn.alphaleagues.com/v1/apex/map/";
    let Arenas = `https://api.mozambiquehe.re/maprotation?version=2&auth=${config.MozambiqueAPI}`;

    const BRRequest = axios.get(BR);
    const ArenasRequest = axios.get(Arenas);

    const getServerCount = async () => {
      // get guild collection size from all the shards
      const req = await client.shard.fetchClientValues("guilds.cache.size");

      // return the added value
      return req.reduce((p, n) => p + n, 0);
    };

    getServerCount().then((count) => {
      axios.all([BRRequest, ArenasRequest]).then(
        axios.spread((...responses) => {
          var BR = responses[0].data;
          var Arenas = responses[1].data.arenas;

          function arenaMapName(name) {
            if (name == "Phase runner") return "Phase Runner";
            if (name == "Party crasher") return "Party Crasher";
            if (name == "Thermal station") return "Thermal Station";
            if (name == "Golden gardens") return "Golden Gardens";
            if (name == "Skull town") return "Skulltown";

            return name;
          }

          client.user.setPresence({
            activity: {
              name: ` on ${BR.map}/${arenaMapName(
                Arenas.current.map
              )} · Serving ${count.toLocaleString()} guilds`,
              type: "PLAYING",
            },
            status: "online",
          });

          console.log(
            chalk`{blueBright [${DateTime.local().toFormat(
              "hh:mm:ss"
            )}] Updated presence, set Battle Royale map to ${
              BR.map
            } and Areans map to ${arenaMapName(Arenas.current.map)}}`
          );
        })
      );
    });
  }

  setPresence();

  setInterval(function () {
    var date = new Date();

    if (date.getMinutes() % 10 == 0) {
      setPresence();
      console.log(
        chalk`{blueBright [${DateTime.local().toFormat("hh:mm:ss")}] Updated presence for ${
          client.user.tag
        }}`
      );
    }
  }, Math.max(1, 1 || 1) * 60 * 1000);
});
