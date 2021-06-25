const fs = require("fs"); // fs is the package we need to read all files which are in folders
const chalk = require("chalk");

module.exports = () => {
	fs.readdir("./events/", (err, files) => {
		if (err) console.err(chalk`{red ${err}}`);

		let jsFiles = files.filter((f) => f.split(".").pop() === "js");

		if (files.length <= 0) return console.log(chalk`{yellow There are no events to load.}`);

		console.log(chalk`{yellow Loading ${jsFiles.length} events...}`);

		jsFiles.forEach((f, i) => {
			require(`./events/${f}`);
			console.log(chalk`{green ${i + 1}: ${f} loaded!}`);
		});
	});
};
