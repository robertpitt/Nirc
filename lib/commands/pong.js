/**
 * COMMAND: NICK
 */
exports = module.exports = {};

/**
 * Export the command name
 */
exports.name = "PONG";

/**
 * Export the handler
 */
exports.handle = function(Message, Client)
{
	Client.log("PONG");
	Client.lastPing = Date.now();
}