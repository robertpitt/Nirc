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
 * Export the user model
 */
exports = module.exports = UsersModel;

/**
 * @constructor
 */
function UsersModel()
{
	this.users = [];
}

UsersModel.prototype.register = function(client, username, hostname, servername, realname)
{
	/**
	 * @TODO, add real user storage here
	 */
	client.setUsername(username);
	client.setRealname(realname);
	this.users.push(client);
	client.register();
}