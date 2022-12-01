module.exports = {
	name: 'ready',
	once: true,
	/**
	 *
	 * @param {Client} client
	 */
	execute(client) {
		console.log('ready');
		console.log(client);
	},
};
