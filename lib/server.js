/**
 * @copyright
 */

/**
 * Load core node dependancies
 */
var _fs 	= require('fs')
var _net 	= require('net')
var _tls 	= require('tls')
var _events = require('events');
var _util 	= require('util');

/**
 * Load the IRC Dependancies
 */
var _Manager = require('./manager.js');


/**
 * Export the server object
 */
exports = module.exports = Server;

/**
 * Expose the version
 */
exports.version = '1.0.0';

/**
 * @constructor
 * Server Instance
 */
function Server(core, server)
{
	/**
	 * Set the IRC to the local scope
	 */
	this.core = core;

	/**
	 * Set the Server to the local scope
	 */
	this.server = server;

	/**
	 * Instantiate the manager
	 */
	this.manager = new _Manager(core, server);

	/**
	 * Bind events
	 */
	this.server.on('connection', this.handleConnection.bind(this));
}

/**
 * Handle a new connection
 */
Server.prototype.handleConnection = function(connection)
{
	/**
	 * Inform the manager of the connection
	 */
	this.manager.handleClientConnection(connection);	
}

/**
 * Create a listener method
 */
Server.prototype.listen = function()
{
	this.server.listen.apply(this.server, arguments);
}