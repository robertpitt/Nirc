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
 * Export the chanel
 */
exports = module.exports = Channel;

/**
 * Export the version
 */
exports.version = '1.0.0';

/**
 * @constructor
 */
function Channel(name)
{
	/**
	 * Channel Name
	 */
	this.name = name;

	/**
	 * Chanel topic
	 */
	this.topic = 'No topic set.';

	/**
	 * Channel clients
	 */
	this.clients = [];

	/**
	 * Chanel Modes
	 */
	this._modes = ['n', 't', 'r'];
}

/**
 * Returns true of a client exists
 */
Channel.prototype.clientExists = function(Client)
{
	/**
	 * Loop the clients and run a comparison check
	 */
	for(var i = 0; i < this.clients.length; i++)
	{
		if(Client.mask() == this.clients[i].mask())
		{
			return true;
		}
	}
}

/**
 * Map a method to each client
 */
Channel.prototype.eachClient = function(cb)
{
	this.clients.forEach(cb);
}

/**
 * Map a method to each client
 */
Channel.prototype.getModeString = function(cb)
{
	return ['+', this._modes.join('')].join('');
}

/**
 * Returns the total clients
 */
Channel.prototype.totalClients = function()
{
	return this.clients.length;
}

/**
 * Returns the channel name
 */
Channel.prototype.getName = function()
{
	return this.name;
}