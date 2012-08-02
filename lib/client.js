/**
 * @copyright
 */

/**
 * Load core node dependancies
 */
var _dns 	= require('dns');
var _util 	= require('util');
var _events	= require('events');

/**
 * Export the Manager
 */
exports = module.exports = Client;

/**
 * Set the Manager Version
 */
exports.version = '1.0.0';

/**
 * IRCManager
 */
function Client(connection)
{
	/**
	 * Construct the parent EventEmitter
	 */
	_events.EventEmitter.call(this);

	/**
	 * Set the connection
	 */
	this.connection = connection;

	/**
	 * Create an empty nick
	 */
	this.nick = null;

	/**
	 * Create a username holder
	 */
	this.username = null;

	/**
	 * the last recorded ping for the client
	 */
	this.lastPinged = null;

	/**
	 * set the registration state
	 */
	this.registered = false;

	/**
	 * Create an empty real name holder
	 */
	this.realname = null;

	/**
	 * Modes Array (Used to store each active mode)
	 */
	this.modes = [];

	/**
	 * Buffer container, used to pre buffer data before emitting events
	 * @private
	 */
	this.__buffer = '';

	/**
	 * Set the remote address
	 */
	this.remoteAddress = connection.remoteAddress;

	/**
	 * Set the hostname
	 */
	this.hostname = connection.remoteAddress;

	/**
	 * Fetch the hostname using the dns.reverse method
	 */
	this.queryHostname();

	/**
	 * Bind the stream events to the local methods
	 */
	this.connection.on('end', this.onDisconnect.bind(this));
	this.connection.on('error', this.onConnectionError.bind(this));
	this.connection.on('data', this.onData.bind(this));
}
_util.inherits(Client, _events.EventEmitter);

/**
 * Return an Id for the Client
 */
Client.prototype.id = function()
{
	return this.nick || "Unregistered";
}

/**
 * Return an Id for the Client
 */
Client.prototype.user = function()
{
	return this.username || "";
}

/**
 * Hostname
 */
Client.prototype.host = function()
{
	return this.hostname || this.remoteAddress;
}

/**
 * Return a generated mask for the client
 */
Client.prototype.mask = function()
{
	return ':' + this.id() + '!' + this.user() + '@' + this.host();
}

/**
 * Return the modes of the user
 */
Client.prototype.modes = function()
{
	return "+" + this.modes.join('');
}

/**
 * Return the modes of the user
 */
Client.prototype.addMode = function(mode)
{
	if(-1 == this.modes.indexOf(mode))
	{
		this.modes.push(mode);
		this.send(this.mask(), 'MODE', this.id(), '+' + mode, this.id());
	}

	return this;
}

/**
 * Return an Id for the Client
 */
Client.prototype.setUsername = function(username)
{
	this.username = username;
	return this;
}

/**
 * Set the NICK
 */
Client.prototype.setRealname = function(realname)
{
	this.realname = realname;
}

/**
 * Set the NICK
 */
Client.prototype.setNick = function(nick)
{
	this.nick = nick;
}

/**
 * Return operator status
 */
Client.prototype.isOperator = function()
{
	return -1 !== this.modes.indexOf('o');
}

/**
 * Return invisible status
 */
Client.prototype.isInvisible = function()
{
	return -1 !== this.modes.indexOf('i');
}

/**
 * Set the NICK
 */
Client.prototype.register = function()
{
	if(this.registered === false && this.nick && this.username)
	{
		/**
		 * Send the welcome pack
		 */
		this.send(this.mask(), '001', this.id(), 'Welcome to @NETWORK@', this.mask())
		this.send(this.mask(), '002', this.id(), 'Your host is', "HOST", 'running version')
		this.send(this.mask(), '003', this.id(), 'This server was created on', "@DATA_HERE@")
		this.send(this.mask(), '004', this.id(), "@NAME@", "@VERSION@");

		/**
		 * Send MOTD
		 */
		this.send(this.mask(), '375', this.id(), ':- Message of the Day -');
		this.send(this.mask(), '372', this.id(), 'No MOTD set');
		this.send(this.mask(), '376', this.id(), ':End of /MOTD command.');

		/**
		 * Add mode
		 */
		this.addMode('w');

		/**
		 * mark the client as registered
		 */
		this.registered = true;
	}
}

/**
 * Return invisible status
 */
Client.prototype.send = function()
{
	var self = this,
		message = arguments.length === 1 ? arguments[0] : Array.prototype.slice.call(arguments).join(' ');

	try
	{
		this.connection.write(message + '\r\n');
	}catch(e)
	{
		console.log("Unable to write to client, disconnecting: %s", this.id());
		this.connection.close();
	}
}

/**
 * handle disconnection of client
 */
Client.prototype.onDisconnect = function()
{
	/**
	 * Inform event handles
	 */
	this.emit('end', this);
}

/**
 * handle pipe errors
 */
Client.prototype.onConnectionError = function(err)
{
	/**
	 * Inform event handles
	 */
	this.emit('err', err, this);
}

/**
 * Handle data
 * This function should buffer until new line is detected, then emit that line
 */
Client.prototype.onData = function(buffer)
{
	/**
	 * Loop the buffer into the global buffer string (__buffer)
	 */
	 this.__buffer =  this.__buffer + buffer.toString();

	 /**
	  * Break the buffer up into CRLF's
	  */
	 var lines = this.__buffer.split(/\r?\n/);

	 this.__buffer = lines.pop();

	 lines.forEach(function(line){
	 	this.emit('line', line, this);
	 }.bind(this));
}

/**
 * bool to check if the user has timed out
 */
Client.prototype.timedOut = function()
{
	/**
	 * Note: This should be configurable
	 */
	return this.lastPinged && ((Date.now() - this.lastPinged) / 1000 > (1000 * 120));
}

/**
 * Query the DNS for the hsotname
 */
Client.prototype.queryHostname = function()
{
	_dns.reverse(this.remoteAddress, function(err, addresses){
		if(err)	return;
		this.hostname = addresses[0] || this.remoteAddress;

		/**
		 * Inform attached event handlers we have updated the hostname
		 */
		this.emit('updated.hostname', this);
	}.bind(this));
}