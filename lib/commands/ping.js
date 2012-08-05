/**
 * COMMAND: NICK
 */
exports = module.exports = {};

/**
 * Export the command name
 */
exports.name = "PING";

/**
 * Export the handler
 */
exports.handle = function(Message, Client)
{
	Client.log("PING");
	Client.lastPing = Date.now();
	Client.send(Client.mask(), "PONG", "HOSTNAME", Client.mask());
}