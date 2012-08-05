/**
 * Testing IRC Server
 */

/**
 * Load the server
 */
var IRCServer = require('../index.js');

/**
 * Create the IRC Server instance
 */
var Server = new IRCServer();

/**
 * Set the server to listen
 */
Server.listen(8080, function(){
	console.log("IRC Server up and running on port %d", 8080)
});