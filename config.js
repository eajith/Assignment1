/*
*
*This file contain the environment settings
*
*/

var environemnts ={}


environemnts.staging = {
	'httpPort':3000,
	'httpsPort':3001,
	'envName' :'staging'
}

environemnts.production = {
	'httpPort' : 4000,
	'httpsPort': 4001,
	'envName'  : 'production'
}

//Determine the environment
var curretEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV : '';

console.log(curretEnv);

//check the current envirionemnt if it not present, default to staging
var chosenEnv = typeof(environemnts[curretEnv]) == 'object' ? environemnts[curretEnv] : environemnts.staging;

console.log(chosenEnv);

//exproting the environmental details
module.exports = chosenEnv;
