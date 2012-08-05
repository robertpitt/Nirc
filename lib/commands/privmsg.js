/**
 * COMMAND: NICK
 */
exports = module.exports = {};

/**
 * Export the command name
 */
exports.name = "PRIVMSG";

/**
 * Export the handler
 */
exports.handle = function(Message, Client)
{
	/**
	 * Make sure we have a channel / user
	 */
	if(!Message.arg(0))
	{
		return Client.send(":HOST", '411', ':No recipient given');
	}

	if(!Message.arg(1) || Message.arg(1).length === 0)
	{
		return Client.send(":HOST", '412', ':No text to send');
	}

	/**
	 * Sanitize the channel name
	 */
	var channel = this.sanitizeChannelName(Message.arg(0));

	if(channel[0] == '#' || channel[0] == '&')
	{
		if(this.channelModel.exists(channel) === false)
		{
			/*Dispatch Error (Channel does not exist)*/
			return;
		}

		/**
		 * Get the channel from the model
		 */
		var _Channel = this.channelModel.get(channel);

		/**
		 * Check if channel is modded and the user has voice
		 */
		//...

		/**
		 * Make sure the user is part of the channel
		 or channel has mode n
		 */
		//..

		_Channel.eachClient(function(member){
			if(member.mask() != Client.mask())
			{
				member.send(Client.mask(), 'PRIVMSG', _Channel.getName(), ':' + Message.arg(1));
			}
		});
		return
	}

	/**
	 * Send a private message to MrX
	 */
	 return

	/**
	 * Send back the member list
	 */
	_Channel.eachClient(function(member){
		/**
		 * @TODO: Check visibilty, operator etc
		 */
		if(false)
		{
			/**
			 * false should be replaced with visible and oper checks
			*/
			return;
		}

		Client.send(Client.mask(),'352',Client.getNick(),_Channel.getName(),member.getUsername(),
			member.getHostname(),'127.0.0.1',
			member.getNick(), //channelUser.channelNick(channel)
			'H', // TODO: H is here, G is gone, * is IRC operator, + is voice, @ is chanop
			':0',
			member.getRealname());
		});

	Client.send(Client.mask(), '315', Client.getNick(), _Channel.getName(), ':End of /WHO list.');
}