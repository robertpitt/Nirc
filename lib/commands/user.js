/**
 * COMMAND: NICK
 */
exports = module.exports = {};

/**
 * Export the command name
 */
exports.name = "USER";

/**
 * Export the handler
 */
exports.handle = function(Message, Client)
{
	if(Message.argsCount() !== 4)
	{
		/**
		 * BAD Command, Maybe disconnect
		 */
		 return;
	}

	this.userModel.register(Client, Message.arg(0), Message.arg(1), Message.arg(3), Message.arg(4));
}