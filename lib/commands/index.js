/**
 * Load Dependancies
 */
var Fs = require("fs")

/**
 * Set the exports to an object
 */
exports = module.exports = {};

/**
 * Scan the local directory
 */
Fs.readdirSync(__dirname).forEach(function(file){
	/**
	 * Skip the current file
	 */
	if(file == "index.js") return;

	/**
	 * Make sure it's not a directory
	 */
	if(Fs.statSync(__dirname + "/" + file).isDirectory()) return;

	/**
	 * Load the file
	 */
	var command = require("./" + file);

	/**
	 * push the command into the stack
	 */
	exports[command.name] = command.handle;
})