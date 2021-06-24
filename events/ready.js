// export the object so it can be required
module.exports = {
	// we want a message event
	event: "ready",
	// we want it to trigger multiple times
	once: false,
	// the actual function
	run(message) {
		console.log("ready");
	},
};
