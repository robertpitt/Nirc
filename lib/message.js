/**
 * @copyright
 */

/**
 * Load core node dependancies
 */

/**
 * Export the message class
 */
exports = module.exports = Message;

/**
 * Export the version
 */
exports.version = '1.0.0';

/**
 * Export the parser
 * NOTE: The following method is very hackish and a full parser should be implemented
 * @static
 */
Message.parse = function(message)
{
	var prefix, command, arguments = [], trailing = '', prefixEnd = -1;

	if(message.charAt(0) == ':')
	{
		//Find the fist 0x20 index
		prefixEnd = message.indexOf(' ');

		//Cut hte prefix out
		prefix = message.substring(1, prefixEnd - 1);
	}

	/**
	 * Detect the trailing ( :) if possible
	 */
	var trailingStart = message.indexOf(' :');
	if(-1 !== trailingStart)
	{
		trailing = message.substring(trailingStart + 2);
	}
	else
	{
		trailingStart = message.length;
	}

	/**
	 * Use the prefix position and trailing start
	 */
	commandAndArgs = message.substring(prefixEnd + 1, trailingStart - prefixEnd - 1).split(' ');

	/**
	 * shift of the command
	 */
	command = commandAndArgs[0];

	/**
	 *
	 */
	if(commandAndArgs.length > 1)
	{
		commandAndArgs.shift()
		arguments = commandAndArgs;
	}

	if(trailing)
	{
		arguments.push(trailing);
	}

	return new Message(prefix, command, arguments);
}

function Message(prefix, command, arguments)
{
	this._prefix 	= prefix;
	this._command	= command;
	this._arguments	= arguments;
}

Message.prototype.getPrefix = function()
{
	return this._prefix;
}

Message.prototype.getCommand = function()
{
	return this._command;
}

Message.prototype.argsCount = function()
{
	return this._arguments.length;
}

Message.prototype.arg = function(i)
{
	return this._arguments[i];
}