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
		 * Validate the channel name
		 */
		if(['#', '&'].indexOf(name[0]) == -1 || name.match(/[\x00\x07\n\r ,]/))
		{
			return Client.send(Client.mask(), '403', ':No such channel');
		}

		/**
		 * Normalize the channel name
		 */
		name = this.sanitizeChannelName(name)

		/**
		 * Create the channel or join
		 */
		this.channelModel.join(name, Client);

		/**
		 * get the chanel object
		 */
		var _Channel = this.channelModel.get(name);

		/**
		 * Inform the channel users of the join
		 */
		_Channel.eachClient(function(client){
			client.send(client.mask(), 'JOIN', _Channel.getName())
		});

		/**
		 * Send the connected client the topic
		 */
		if(_Channel.getTopic())
		{
			Client.send(this.host(), '332', Client.getNick(), _Channel.getName(), ':' + _Channel.getTopic());
		}

		Client.send(this.host(), '353', Client.getNick(), _Channel.getType(), _Channel.getType(), ':' + _Channel.getNameList());
	}.bind(this));
}