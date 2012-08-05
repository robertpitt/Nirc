/**
 * COMMAND: NICK
 */
exports = module.exports = {};

/**
 * Export the command name
 */
exports.name = "MODE";

/**
 * Export the handler
 */
exports.handle = function(Message, Client)
{
	if(Message.arg(0))
	{
		/**
		 * Clean the channel name up
		 */
		channel = this.sanitizeChannelName(Message.arg(0));

		/**
		 * make sure the channel exists
		 */
		if(!this.channelModel.exists(channel))
		{
			/**
			 * Dispatch Error
			 */
			return;
		}

		var _Channel = this.channelModel.get(channel);

		/**
		 * Check to see if we any modes
		 */
		if(Message.arg(1))
		{
			/**
			 * Deal with channel modes
			 */
			return;
		}
		else
		{
			/**
			 * Send the channel modes
			 */
			Client.send(Client.mask(), '324', Client.getNick(), _Channel.getName(), _Channel.getModeString());
		}

		/**
		 * 
		 */
	}
}