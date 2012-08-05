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

	Client.log("Requested JOIN " + channelNames);

	channelNames.split(',').forEach(function(channel){
		var parts = channel.split(' '),
			name = parts[0];

		/**
		 * Validate the channel name
		 */
		if(['#', '&'].indexOf(name[0]) == -1 || name.match(/[\x00\x07\n\r ,]/))
		{
			return Client.send(this.mask(), '403', ':No such channel');
		}

		/**
		 * Normalize the channel name
		 */
		name = this.sanitizeChannelName(name)

		/**
		 * Create the channel or join
		 */
		this.channelModel.join(name, Client)
	}.bind(this));
}