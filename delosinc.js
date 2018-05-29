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
          } else {
          return 'Please Enter a valid ID number';
      }
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
		message: "Thank you for choosing Delos Destinations for your next adventure. \n Please select a desired narrative based on its ID number",
		validate: idCheck
	},
	{
		type: "input",
		name: "purchase_slot",
		message: "Please enter how many slots you would like to purchase",
		validate: numCheck
	}
	]).then(function(guestRes){
		var guestPurchaseSlot = parseInt(guestRes.purchase_slot);
		var guestPurchaseID = parseInt(guestRes.narrative_id);

		connection.query("SELECT * FROM narratives",function(err,res){
			var currentSlots = res[guestPurchaseID - 1].available_slots;
			if(guestPurchaseSlot > currentSlots){
				console.log("\nSorry, there are not enough avaliable slots to complete your transaction. Please Try again.");
				tableGuestAccess();
			} else {
				    connection.query(
				    	"UPDATE narratives SET ? WHERE ?", 
				    	[
				    	{
            				available_slots: currentSlots - guestPurchaseSlot
        				},
        				{
            				id: guestPurchaseID
        				}
    ], function(err) {
        if (err) throw err;
        else {
            console.log("\n Congratulations!\n Your transaction has been processed.\n Please await a confirmation email in 3-5 business days with details of your desired narrative\n");
            login();
        }
    })
			}
		})
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
  .then(adminTools);
}

function adminTools(){
	inquirer.prompt(
	{
		type: "list",
		message: "AUTHORIZED PERSONNEL ONLY || Delos Admin Panel",
		choices: ["View current park narratives","View narratives by park","Create New narrative", "Add available slots","Exit"],
		name: "actions"
	}).then(function(admin){
		switch (admin.actions){
			case "View current park narratives":
			tableAdminAccess();
			break;
			case "View narratives by park":
			viewByPark();
			break;
			case "Create New narrative":
			createNarrative();
			break;
			case "Add available slots":
			addSlots();
			break;
			case "Exit":
			exit();
			break;
			default:
			exit();
		}
	})
}

function tableAdminAccess(){

	connection.query("SELECT * FROM narratives",function(err,res){

	var table = new Table({
		head: ["ID","Narrative","Location (Park)","Price (USD)","Active Slots","Open Slots"],
		colWidths: [5,20,20,15,15,15]
	});
	for (var i=0; i<res.length; i++){
		table.push(
    		[res[i].id, 
    		 res[i].narrative_name,
    		 res[i].park_name,
    		 res[i].price,
    		 res[i].active_slots,
    		 res[i].available_slots]
		);
	}
	console.log("\n" + table.toString() + "\n");
	adminTools();
	});
}

const parkCheck = value => {
			switch (value){
				case 'WestWorld':
				case 'ShogunWorld':
				case 'The Raj':
				case 'MedievalWorld':
				case 'RomanWorld':
				case 'FutureWorld':
				case 'RESTRICTED':
				return true;
			}
			return 'Please enter a valid park name';
			};


function viewByPark(){
		inquirer.prompt(
		{
			type: "input",
			message: "Enter park name",
			name: "park",
			validate: parkCheck
		}).then(function(answer){
			console.log("\n" + answer.park);
			connection.query (
				"SELECT * FROM narratives WHERE ?",
				{park_name : answer.park},
				function(err, res){
					var table = new Table({
					head: ["ID","Narrative","Price (USD)","Active Slots","Open Slots"],
					colWidths: [5,20,20,15,15]
					});
				for (var i=0; i<res.length; i++){
					table.push(
			    		[res[i].id, 
			    		 res[i].narrative_name,
			    		 res[i].price,
			    		 res[i].active_slots,
			    		 res[i].available_slots]
					);
				}
	console.log("\n" + table.toString() + "\n");
	adminTools();	
		})
	})
}

function createNarrative(){
	console.log("\nintializing...\n");
	inquirer.prompt([
	{
		type: "input",
		message: "Welcome to the narrative creator - Please enter a name for this narrative",
		name: "newNarrative"
	},
	{
		type: "list",
		message: "Select a park for this narrative",
		choices: ["WestWorld","ShogunWorld","The Raj","MedievalWorld","RomanWorld","FutureWorld"],
		name: "newLocation"
	},
	{
		type: "input",
		message: "Set price point for slots in this narrative (USD):",
		name: "newPrice"
	},
	{
		type: "input",
		message: "Set number of slots for this narrative:",
		name: "newSlots"
	}
	]).then(function(res){
		connection.query(
			"INSERT INTO narratives SET ?",
			{
				narrative_name: res.newNarrative,
				park_name: res.newLocation,
				price: res.newPrice,
				available_slots: res.newSlots
			},function(err){
				if (err) throw (err);
				console.log("\n New narrative: " + res.newNarrative + " was created successfully.\n This narrative will be avaiable at " + res.newLocation + "\n ETC 72 HOURS\n Generating hosts for storyline...\n");
				adminTools();
			});
});
}

function addSlots(){
	inquirer.prompt([
	{
		type: "input",
		message: "Enter narrative ID",
		name: "narrative_id",
		validate: idCheck
	},
	{
		type: "input",
		message: "Enter additonal slot allotments",
		name: "slotsAdded",
		validate: numCheck
	}
	]).then(function(updates){
		var addSlots = parseInt(updates.slotsAdded);
		var narID = parseInt(updates.narrative_id);

		connection.query(
			"SELECT * FROM narratives",
			function(err, res){
				var currentSlots = res[narID - 1].available_slots;
				connection.query(
					"UPDATE narratives SET ? WHERE ?",
					[{
						available_slots: currentSlots + addSlots
					},
					{
						id: narID
					}], function(err){
						if (err) throw err;
						else {
							console.log("Avaiable slots for this narrative has been updated.");
							adminTools();
						}
					})
			})
	})
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

