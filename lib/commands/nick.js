/**
 * COMMAND: NICK
 */
exports = module.exports = {};

/**
 * Export the command name
 */
exports.name = "NICK";

/**
 * Export the handler
 */
exports.handle = function(Message, Client)
{
	/**
	 * Validate that we have a nick
	 */

	if(!Message.arg(0) || Message.arg(0).length == 0)
	{
		Client.send(client.mask(), 401, ':No nickname given')
		return;
	}

	/**
	 * no need to udpate the same nick
	 */
	if(Message.arg(0) == Client.id())
	{
		return;
	}

	/**
	 * Validate NICK is valid
	 */
	if(Message.arg(0).length > 9 || Message.arg(0).match(/^[^a-z]|[^\w_^`\\\[\]{}]/))
	{
		Client.send("HOST", 432, (Client.id() || ''), Message.arg(0), ':Erroneus nickname');
		return;
	}

	/**
	 * Check to see if the nick already exists
	 * @TODO
	 */

	/**
	 * Set the nick and register
	 */
	Client.setNick(Message.arg(0));
}