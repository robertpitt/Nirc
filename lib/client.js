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
 * Log out to the console
 */
Client.prototype.log = function(message)
{
	console.log("Client Log: %s\t(" + message + ")", this.nick || "Unknown")
}

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
 * Set the clients username
 */
Client.prototype.setUsername = function(username)
{
	this.username = username;
	return this;
}

/**
 * Return an username for the Client
 */
Client.prototype.getUsername = function()
{
	return this.username;
}

/**
 * Return the clients hostname
 */
Client.prototype.getHostname = function()
{
	return this.hostname || "";
}

/**
 * Set the ealname
 */
Client.prototype.setRealname = function(realname)
{
	this.realname = realname;
}

/**
 * Set the NICK
 */
Client.prototype.setRealname = function(realname)
{
	this.realname = realname;
	return this;
}

/**
 * Set the NICK
 */
Client.prototype.getRealname = function()
{
	return this.realname;
}

/**
 * Set the nickname
 */
Client.prototype.setNick = function(nick)
{
	this.nick = nick;
	return this;
}


/**
 * Get the NICK
 */
Client.prototype.getNick = function()
{
	return this.nick;
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
 * Return invisible status
 */
Client.prototype.isRegistered = function()
{
	return this.registered;
}

Client.prototype.setRegistered = function(registered)
{
	this.registered = registered ? true : false;
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