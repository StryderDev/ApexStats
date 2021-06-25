const fs = require("fs");
const chalk = require("chalk");

module.exports = () => {
	fs.readdir("./events/discord/", (err, files) => {
		if (err) console.log(chalk`{red ${err}}`);

		let jsFiles = files.filter((f) => f.split(".").pop() === "js");

		if (files.length <= 0) return console.log(chalk`{yellow There are no events to load.}`);

		console.log(chalk`{yellow Loading ${jsFiles.length} events...}`);

		jsFiles.forEach((f, i) => {
			require(`./discord/${f}`);
			console.log(chalk`{green ${i + 1}: ${f} loaded!}`);
		});
	});

	fs.readdir("./events/rotations/", (err, files) => {
		if (err) console.log(chalk`{red ${err}}`);

		let jsFiles = files.filter((f) => f.split(".").pop() === "js");

		if (files.length <= 0) return console.log(chalk`{yellow There are no rotations to load.}`);

		console.log(chalk`{yellow Loading ${jsFiles.length} rotations...}`);

		jsFiles.forEach((f, i) => {
			require(`./rotations/${f}`);
			console.log(chalk`{green ${i + 1}: ${f} loaded!}`);
		});
	});
};
