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
var Channel	= require('../channel.js');

/**
 * Export the user model
 */
exports = module.exports = Channels;

/**
 * @constructor
 */
function Channels()
{
	/**
	 * Inherit from EventEmitter
	 */
	_events.EventEmitter.call(this);

	/**
	 * Create a holder
	 * @question: Should this be persistant
	 */
	this.channels = [];
}
_util.inherits(Channels, _events.EventEmitter);

/**
 * Add's a channel a channel from te stack
 */
Channels.prototype.create = function(channel)
{
	if(this.exists(channel))
	{
		return this.get(channel);
	}

	/**
	 * Instantiate a new Channel Object and push it into the stack.
	 */
	var _Channel = new Channel(channel);

	/**
	 * Push the channel into the stack
	 */
	this.channels.push(_Channel);

	/**
	 * Emit the new channel to any listeners
	 */
	this.emit('create', _Channel);

	/**
	 * return teh newly created channel
	 */
	return _Channel;
}

/**
 * Associates a user with a channel
 */
Channels.prototype.join = function(name, Client, key)
{
	/**
	 * Check to see if the channel exists
	 */
	if(this.exists(name) === false)
	{
		Client.log("Creating channel: " + name);
		/**
		 * Create the channel
		 */
		this.create(name);
	}

	/**
	 * Get the channel
	 */
	var _Channel = this.get(name);

	/**
	 * Checks todo
	 * -- 1. Check if {Client} is already a member
	 * 2. Check to see if the channel is invite only, if so check the invite list
	 * 3. Check to see if the {Client} is banned
	 * 4. Check the channel max clients
	 * 5. Check the channel key (if-exists)
	 */
	if(_Channel.clientExists(Client))
	{
		return;
	}

	/**
	 * Add the client
	 * @TODO: Make this a controlled method
	 */
	_Channel.clients.push(Client);

	/**
	 * Emit the join event
	 */
	this.emit('join', Client, _Channel);

	/**
	 * First Client get's op status
	 */
	if(_Channel.totalClients() === 0)
	{
		Client.log("Assigning OP status");
	}

	/**
	 * Inform the channel users of the join
	 */
	_Channel.eachClient(function(client){
		client.send(client.mask(), 'JOIN', _Channel.getName())
	});
}

/**
 * Remove's a channel from te stack
 */
Channels.prototype.leave = function(channel, Client)
{
	if(Client && this.exists(channel))
	{
		/**
		 * Get the channel
		 */
		var _Channel = this.get(channel);
		
		/**
		 * Emit the join event
		 */
		this.emit('leave', Client, _Channel);
	}
}

/**
 * Checks existance of a channel
 */
Channels.prototype.exists = function(chName)
{
	for(var i = 0; i < this.channels.length; i++)
	{
		if(this.channels[i].getName() == chName)
		{
			return true;
		}
	}

	return false;
}

/**
 * Return's a channel if exists
 */
Channels.prototype.get = function(chName)
{
	for(var i = 0; i < this.channels.length; i++)
	{
		if(this.channels[i].getName() == chName)
		{
			return this.channels[i];
		}
	}
}