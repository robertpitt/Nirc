/**
 * COMMAND: NICK
 */
exports = module.exports = {};

/**
 * Export the command name
 */
exports.name = "PART";

/**
 * Export the handler
 */
exports.handle = function(Message, Client)
{
	/**
	 * Make sure wa have the channel name
	 */
	if(!Message.arg(0))
	{
		return;
	}

	/**
	 * Santize the channel
	 */
	var channel = this.sanitizeChannelName(Message.arg(0));

	if(!this.channelModel.exists(channel))
	{
		return;
	}

	/**
	 * Leave the channel
	 */
	this.channelModel.partClient(Client);

	_Channel = this.channelModel.get(channel);
	var partMessage = Message.arg(1) ? ' :' + Message.arg(1) : '';

	_Channel.eachClient(function(member){
		member.send(Client.mask(), 'PART', _Channel.getName() + partMessage);
	});
}