const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const axios = require("axios");
const { DateTime, Duration } = require("luxon");

module.exports = {
  name: "map",
  description: "Shows the current in-game map rotation.",
  options: [
    {
      name: "amount",
      description: "The amount of future rotations you'd like to see.",
      type: "INTEGER",
      required: false,
    },
  ],
  run: async (client, interaction) => {
    const amount = interaction.options.get("amount");

    function checkAmount(amount) {
      if (amount == null || amount == undefined) return "1";

      return amount.value;
    }

    const pluralize = (count, noun, suffix = "s") =>
      `${count} ${noun}${count !== 1 ? suffix : ""}`;

    function getTime(time) {
      var now = DateTime.local();
      var nowSeconds = Math.floor(DateTime.local().toSeconds());
      var math = time - nowSeconds;
      var future = DateTime.local().plus({ seconds: math + 60 });

      var timeUntil = future.diff(now, ["hours", "minutes", "seconds"]);

      var time = timeUntil.toObject();

      return `${pluralize(time.hours, "hour")}, ${pluralize(
        time.minutes,
        "minute"
      )}`;
    }

    function mapImage(map) {
      var maps = ["Kings Canyon", "World's Edge", "Olympus"];
      var mapName = map
        .replace(
          /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
          ""
        )
        .replace(/\s/g, "");

      if (maps.indexOf(map) != -1) {
        // _01 for Ranked Split 1
        // _02 for Ranked Split 2
        return `Season%209/${mapName}_02.gif`;
      } else {
        return "NoMapData.png";
      }
    }

    axios
      .get(
        `https://fn.alphaleagues.com/v2/apex/map/?next=${checkAmount(amount)}`
      )
      .then((result) => {
        var map = result.data.br;
        var next = map.next;

        function nextMaps(next) {
          return next.map(
            (x) =>
              `**${x.map}**\nStarts in ${getTime(
                x.timestamp
              )} and lasts for ${Duration.fromMillis(
                x.duration * 60 * 1000
              ).toFormat("h'h,' m'm.'")}\n\n`
          );
        }

        const currentMap = new MessageEmbed()
          .setDescription(
            `:map: The current map is **${map.map}** for ${getTime(
              map.times.next
            )}.\n:clock1: The next map is **${
              next[0].map
            }** and lasts for ${Duration.fromMillis(
              next[0].duration * 60 * 1000
            ).toFormat("h'h,' m'm.'")}`
          )
          .setImage(`https://cdn.apexstats.dev/Maps/${mapImage(map.map)}`)
          .setFooter("Provided by https://rexx.live/");

        const futureMap = new MessageEmbed()
          .setDescription(`${nextMaps(next)}.`)
          .setFooter("Provided by https://rexx.live/");

        if (checkAmount(amount) == 1) {
          interaction.editReply({ embeds: [currentMap], content: "\u200B" });
        } else {
          interaction.editReply({ embeds: [futureMap], content: "\u200B" });
        }
      });
  },
};
