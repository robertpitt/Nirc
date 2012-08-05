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
 * Channel Type
 */
Channel.prototype.getType = function()
{
	if(-1 != this._modes.indexOf('p'))
	{
		return '*';
	}

	if(-1 != this._modes.indexOf('s'))
	{
		return '@';
	}

	return '=';
}

/**
 * Get SSL Of names A' 'B
 */
Channel.prototype.getNameList = function()
{
	return this.clients.map(function(_Client){
		/**
		 * Should be checking for chanel codes here from User Object
		 */
		return _Client.getNick();
	}).join(' ');
}

/**
 * Return the topic for the channel.
 */
Channel.prototype.getTopic = function(cb)
{
	return this.topic;
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