const { client, Discord } = require("../ApexStats.js");
require("dotenv").config();
const config = require("../config.json");
const fs = require("fs");
const moment = require("moment"); //replace

module.exports = {
  name: "map",
  description: "Shows current map rotation.",
  execute(message, args) {
    console.log("current map is :D");
  },
};
