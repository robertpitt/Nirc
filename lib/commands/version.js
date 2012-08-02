/**
 * COMMAND: NICK
 */
exports = module.exports = {};

/**
 * Export the command name
 */
exports.name = "VERSION";

/**
 * Export the handler
 */
exports.handle = function(Message, Client)
{
	Client.send(Client.mask(), '1.0.0', Client.id(), '1.0.0' + '.', "HOST" , "NAME");
}