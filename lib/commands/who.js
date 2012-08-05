/**
 * COMMAND: NICK
 */
exports = module.exports = {};

/**
 * Export the command name
 */
exports.name = "WHO";

/**
 * Export the handler
 */
exports.handle = function(Message, Client)
{
	/**
	 * Make sure we have a channel
	 */
	if(!Message.arg(0))
	{
		return;
	}

	/**
	 * Sanitize the channel name
	 */
	var channel = this.sanitizeChannelName(Message.arg(0));

	/**
	 * Make sure the channel exists
	 */
	if(!this.channelModel.exists(channel))
	{
		//Send Error here
		return;
	}

	/**
	 * Get the channel from the model
	 */
	var _Channel = this.channelModel.get(channel);

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

		Client.send(this.host(),'352',Client.getNick(),_Channel.getName(),member.getUsername(),
			member.getHostname(),'127.0.0.1',
			member.getNick(), //@NICK for OP, NICK FOR Normal
			'H', // TODO: H is here, G is gone, * is IRC operator, + is voice, @ is chanop
			':0',
			member.getRealname()
		);
	}.bind(this));

	Client.send(this.host(), '315', Client.getNick(), _Channel.getName(), ':End of /WHO list.');
}