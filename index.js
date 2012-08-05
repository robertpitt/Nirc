/**
 * @copyright
 */

 /**
  * Resources being used:
  * @link https://www.alien.net.au/irc/irc2numerics.html
  * @link http://tools.ietf.org/html/rfc1459
  */

/**
 * Load core node dependancies
 */
var _fs 	= require('fs');
var _net 	= require('net');
var _tls 	= require('tls');
var _events = require('events');
var _util 	= require('util');

/**
 * Load IRC Depenancies
 */
var _Server	 = require('./lib/server.js');

/**
 * Export the server
 */
exports = module.exports = IRC;

/**
 * Expose the version
 */
exports.version = '1.0.0';

/**
 * Create the IRC wrapper
 */
function IRC()
{
	/**
	 * Create the default configuration container
	 */
	this.settings = {};

	/**
	 * Create the server holder.
	 */
	this._server = null;

	/**
	 * Set the defualt enviroment
	 */
	this.config('env', process.env.NODE_ENV || 'development');

	/**
	 * Set the default configurations
	 */
	this.configure(function(){

		/**
		 * Set teh default Enviroment
		 */
		this.config('env', process.env.NODE_ENV || 'development');

		/**
		 * Set the Server options
		 */
		this.config('server.options', {});

		/**
		 * Set the default MOTD
		 */
		this.config('motd', [
			"Welcome to our server, we hope you enjoy using this NodeIRC Server",
			"Feel free to contact the developers for support"
		]);
	});

	/**
	 * Configure defualt development mode
	 */
	this.configure('development', function(){

	});

	/**
	 * Configure defualt production mode
	 */
	this.configure('production', function(){

	});
}

/**
 * Set/Get Configuration values
 */
IRC.prototype.config = function(key, value)
{
	if(1 == arguments.length)
	{
		return this.settings[key] || null;
	}

	/**
	 * Set the value and return the context.
	 */
	this.settings[key] = value;
	return this;
}

/**
 * Helper method for getting configuration values.
 */
IRC.prototype.getConfig = function(key)
{
	return this.config(key);	
}

/**
 * Helper method for setting configuration values.
 */
IRC.prototype.setConfig = function(key, value)
{
	return this.config(key, value);
}

/**
 * Create the configuration helper
 * Usage much like express
 *
 * irc.configure(function(){
 *	//Configure for all enviroments
 * })
 *
 * irc.configure('development', function(){
 *	//Configure for dev enviroments
 * })
 *
 * irc.configure('production', function(){
 *	//Configure for proc enviroments
 * })
 */
IRC.prototype.configure = function(env, fn)
{
	var envs = 'all';
	var args = [].slice.call(arguments);
	fn = args.pop();

	if (args.length) envs = args;
	if ('all' == envs || ~envs.indexOf(this.settings.env)) fn.call(this);
	return this;
}

/**
 * Instantiate the server and start listening
 */
IRC.prototype.listen = function()
{
	/**
	 * make sure listen is only fired once
	 */
	if(this._server !== null)
	{
		throw "Server already listening";
	}

	/**
	 * Check for TLS Support
	 */
	if(this.getConfig('tls'))
	{
		if(typeof this.getConfig('tls') !== "object")
		{
			throw "Configuration Error, tls should be an object";
		}

		var _server = _tls.createServer(this.getConfig('tls'));
	}else
	{
		var _server = _net.createServer(this.getConfig('server.options'))
	}

	/**
	 * Create a new server wrapper passing in the IRC and server
	 */
	this._server = new _Server(this, _server);
	this._server.listen.apply(this._server, arguments);
	return this;
}