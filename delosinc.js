var mysql = require("mysql");
var inquirer = require ("inquirer");
var table = require ("cli-table2");

var connection = mysql.createConnection({
	host:"localhost",
	port: 3306,
	user: "root",
	password: "password",
	database: "delos_DB"
});

connection.connect(function (err){
	if (err) throw err;
	login();
})

function exit(){
	console.log("Thank You for choosing Delos Destinations\nTerminating Connection...");
	connection.end();
}

function login(){
	inquirer.prompt([
	{
		type: "list",
		message: "Welcome to Delos Destinations, please login for access",
		choices: ["Guest", "Admin", "Director", "Exit"],
		name: "credentials"
	}
	]).then(function(access){
		switch (access.credentials) {
			case "Guest":
			guestAccess();
			break;
			case "Admin":
			adminAccess();
			break;
			case "Director":
			directorAccess();
			break;
			case "Exit":
			exit();
			break;
			default:
			exit();
		}
	});
}

function guestAccess(){
inquirer
  .prompt([
    {
      type: 'password',
      message: 'Welcome Guest #3203A, \n Please enter your password to access Park Narratives\n Password: ',
      name: 'guestPass',
      mask: '*'
    }
  ])
  .then(login);
}

const adminPassword = value => {
  if (value === "violentdelights") {
    return true;
  }
  return 'ACCESS DENIED - INCORRECT PASSWORD';
};

function adminAccess(){
inquirer
  .prompt([
    {
      type: 'password',
      message: 'Authorized Personnel Only\n PLEASE ENTER PASSWORD',
      name: 'adminPass',
      mask: '*',
      validate: adminPassword
    }
  ])
  .then(login);
}

const directorPassword = value => {
  if (value === "violentends") {
    return true;
  }
  return 'ACCESS DENIED - INCORRECT CREDENTIALS';
};

function directorAccess(){
inquirer
  .prompt([
    {
      type: 'password',
      message: 'RESTRICTED\n @434projectMAZE#_HOST=restricted\n intialize WYATT => true\n CREDENTIAL: ',
      name: 'directPass',
      mask: '*',
      validate: directorPassword
    }
  ])
  .then(login);
}
