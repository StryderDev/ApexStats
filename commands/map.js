const { client, Discord } = require("../ApexStats.js");
require("dotenv").config();
const config = require("../config.json");
const fs = require("fs");
const moment = require("moment"); //replace
const axios = require("axios");

module.exports = {
  name: "map",
  description: "Shows current map rotation.",
  execute(message, args) {
    message.channel
      .send("Getting current map rotation schedule...")
      .then(async (msg) => {
        axios
          .get("https://fn.alphaleagues.com/v1/apex/map/")
          .then((res) => {
            const map = new Discord.MessageEmbed().setDescription(
              `The current map is **${res.data.map}**`
            );

            msg.delete();
            msg.channel.send(map);
          })
          .catch((err) => {
            console.log(err);
          });
      });
  },
};
