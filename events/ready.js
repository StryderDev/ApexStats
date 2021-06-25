const { client } = require("../Apex.js");
const chalk = require("chalk");
const { DateTime } = require("luxon");

client.once("ready", () => {
	console.log(chalk`{yellow [${DateTime.local().toFormat("hh:mm:ss")}] Logging in...}`);
	console.log(chalk`{green [${DateTime.local().toFormat("hh:mm:ss")}] Logged in as ${client.user.tag}}`);
});
