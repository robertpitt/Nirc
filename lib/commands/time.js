/**
 * COMMAND: NICK
 */
exports = module.exports = {};

/**
 * Export the command name
 */
exports.name = "TIME";

/**
 * Export the handler
 */
exports.handle = function(Message, Client)
{
	Client.send(this.mask(), '391', Client.id(), "HOSTNAME", ':' + (new Date()));
}