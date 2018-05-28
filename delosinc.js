var mysql = require("mysql");
var inquirer = require ("inquirer");
var Table = require ("cli-table");

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
  .then(tableGuestAccess);
}

function tableGuestAccess(){

	connection.query("SELECT * FROM narratives",function(err,res){

	var table = new Table({
		head: ["ID","Narrative","Location","Price (USD)","Slots"],
		colWidths: [5,20,20,15,10]
	});
	for (var i=0; i<res.length; i++){
		table.push(
    		[res[i].id, 
    		 res[i].narrative_name,
    		 res[i].park_name,
    		 res[i].price,
    		 res[i].available_slots]
		);
	}
	console.log(table.toString());
	guestActions();
	});
	}

function idCheck(input) {
          if (isNaN(input) === false) {
            return true;
          }
          return 'Please Enter a valid ID number';
}

function numCheck(input) {
          if (isNaN(input) === false) {
            return true;
          }
          return 'Please Enter a valid number';
}

function guestActions(){
	inquirer.prompt([
	{
		type: "input",
		name: "narrative_id",
		message: "Thank you for choosing Delos Destinations as your next adventure. \n Please select a desired narrative based on its ID number",
		validate: idCheck
	},
	{
		type: "input",
		name: "purchase_slot",
		message: "Please enter how many slots you would like to purchase",
		validate: numCheck
	}
	]).then(function(answer){
		console.log("testing");
		login();
	})
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

