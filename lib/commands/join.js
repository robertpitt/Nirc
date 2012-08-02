/**
 * COMMAND: NICK
 */
exports = module.exports = {};

/**
 * Export the command name
 */
exports.name = "JOIN";

/**
 * Export the handler
 */
exports.handle = function(Message, Client)
{
	/**
	 * Get the channel names
	 */
	var channelNames = Message.arg(0);

	/**
	 * Check to make sure the name is valid
	 */
	if(!channelNames)
	{
		//Send error 461 (Need more parameters)
		Client.send(Client.mask(), '461', this.id(), ':Need more parameters')
		return;
	}

	channelNames.split(',').forEach(function(channel){
		var parts = channel.split(' '),
			name = parts[0];

		/**
		 * Check for channel existence
		 * @TODO, actually implement channels
		 */
		Client.send(Client.mask(), '403', ': No such channel');
	})
}