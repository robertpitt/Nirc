/**
 * @copyright
 */

/**
 * Load core node dependancies
 */
var _fs 	= require('fs')
var _events = require('events');
var _util 	= require('util');

/**
 * Load IRC Dependancies
 */
var _Client 	= require('./client.js');
var _Message 	= require('./message.js');
var _Commands 	= require('./commands/');
var _UserModel 	= require('./models/users.js');
var _ChannelModel 	= require('./models/channels.js');

/**
 * Export the Manager
 */
exports = module.exports = IRCManager;

/**
 * Set the Manager Version
 */
exports.version = '1.0.0';

/**
 * IRCManager
 */
function IRCManager(core, server)
{
	/**
	 * Client Stack
	 * NOTE: this should be a class with helper methods
	 */
	this.clients = [];

	/**
	 * Set the IRC
	 */
	this.core = core;

	/**
	 * instantiate the user model
	 */
	this.userModel = new _UserModel();

	/**
	 * Instantiate the channel model
	 */
	this.channelModel = new _ChannelModel();

	/**
	 * Bind events to the ChannelModel
	 */
	this.channelModel.on('create', this.onChannelCreated.bind(this))
	this.channelModel.on('join', this.onChannelJoin.bind(this))
	this.channelModel.on('leave', this.onChannelLeave.bind(this));

	/**
	 * Create a interval loop to monitor for user timeouts
	 * NOTE: This should be configurable
	 */
	this.userIntervalID = setInterval(this._handleTimeouts.bind(this), 1000 * 5);
};

IRCManager.prototype.sanitizeChannelName = function(name)
{
	return name.toLowerCase().replace(/\{/g, '[').replace(/\}/g, ']').replace(/\|/g, '\\').trim();
};

/**
 * Check user timeouts
 */
IRCManager.prototype._handleTimeouts = function()
{
	for(var i = 0; i < this.clients.length; i++)
	{
		if(this.clients[i].timedOut())
		{
			console.log("Timeout: %s", this.clients[i].mask());

			/**
			 * Disconnect the client
			 */
			this.clients[i].disconnect();

			/**
			 * Remove the client from the stack
			 */
			this.clients.splice(1, i);
		}
	}
}

IRCManager.prototype.onChannelLeave = function(_Client, _Channel)
{
	_Client.log("Parted " + _Channel.getName());
};

IRCManager.prototype.onChannelJoin = function(_Client, _Channel)
{
	_Client.log("Joined " + _Channel.getName());
};

IRCManager.prototype.onChannelCreated = function(_Channel)
{
};

IRCManager.prototype.handleClientConnection = function(connection)
{
	/**
	 * Create a new client
	 */
	var client = new _Client(connection);

	/**
	 * Monitor for conenction ends
	 */
	client.on('end', this.handleClientDisconnect.bind(this));

	/**
	 * Monitor for command lines
	 */
	client.on('line', this.onCommand.bind(this));
}

/**
 * Handles the removal of the client from teh store
 */
IRCManager.prototype.onCommand = function(line, client)
{
	var message = _Message.parse(line);
	client.log(line);

	/**
	 * See if the command is available to handle
	 */
	if(message.getCommand() in _Commands)
	{
		_Commands[message.getCommand()].call(this, message, client);
	}
}

/**
 * Handles the removal of the client from teh store
 */
IRCManager.prototype.handleClientDisconnect = function(client)
{
	console.log("Disconnected: %s", client.mask());
}