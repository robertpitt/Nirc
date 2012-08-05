/**
 * COMMAND: NICK
 */
exports = module.exports = {};

/**
 * Export the command name
 */
exports.name = "USER";

var creationDate = new Date();

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

	/**
	 * If the client is already registered, ignore
	 */
	if(/*Client.isRegistered === true*/false)
	{
		return;
	}

	/**
	 * Set the username
	 */
	Client.setUsername(Message.arg(0));

	/**
	 * Set the realname
	 */
	Client.setRealname(Message.arg(4));

	/**
	 * the client as registered
	 */
	Client.setRegistered(true);

	/**
	 * Small helper function to template the messages
	 */
	var process = function(text)
	{
		if(!text) return "";
		return text.replace("@HOST", this.core.getConfig('hostname'))
				.replace("@VERSION@", this.core.getConfig('version'))
				.replace("@CREATIONDATE", creationDate).replace(/^\@[A-Z]+$\@/, '');

		// What else am I missing?
	}.bind(this);

	/**
	 * Send the welcome message
	 */
	Client.send(this.host(), '001', Client.id(), process(this.core.getConfig('welcome_message')))
	Client.send(this.host(), '002', Client.id(), 'Your host is', this.core.getConfig('hostname'), this.core.getConfig('version'))
	Client.send(this.host(), '003', Client.id(), 'This server was created', creationDate);
	Client.send(this.host(), '004', Client.id(), this.core.getConfig('hostname'), process("Nirc-@VERSION@"));

	/**
	 * Send MOTD
	 */
	Client.send(this.host(), '375', Client.id(), ":-","Message of the Day -");
	Client.send(this.host(), '372', Client.id(), process(this.core.getConfig('motd')));
	Client.send(this.host(), '376', Client.id(), ':End of /MOTD command.');

	/**
	 * Add the initial modes to the client
	 */
	Client.addMode('w');
}