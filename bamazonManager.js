var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "Bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  runSearch();
});

var runSearch = function() {
  inquirer.prompt({
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View Products for Sale",
      "View Low Inventory",
      "Add to Inventory",
      "Add New Product",
    ]
  }).then(function(answer) {
    console.log(answer.action);
    if (answer.action === "View Products for Sale") {
      availableItems();
    } else if (answer.action === "View Low Inventory") {
      lowInventory();
    } else if (answer.action === "Add to Inventory") {
      addInventory();
    } else if (answer.action === "Add New Product") {
      addNew();
    }
  });
};

//function to show list of item
var availableItems = function() {
      connection.query('select * from products', function(err, res) {
      if (err) throw err;
      console.table(res);
      runSearch();
    });
}; 

var lowInventory = function() {
  connection.query('select * from products where stock_quantity <= 5', function(err, res) {
    console.table(res);
    runSearch();
  });
};

var addInventory = function() {
      inquirer.prompt([
             {
              name: "id",
              message: "Enter the id of the item you would like to add."
            }, {
              name: "quantity",
              message: "Enter the quantity."
            }, 

        ]).then(function (answers) {
           id = answers.id;
           quantity = answers.quantity;

        connection.query("select stock_quantity, price from products where ?", { item_id: id }, function(err, res) {
        if (err) throw err;
            var stock_quantity = res[0].stock_quantity;
            var price = res[0].price;
            newQuantity = parseInt(stock_quantity) + parseInt(quantity); 
            connection.query("update products set ? where ?", [{stock_quantity: newQuantity}, {item_id: id}], function(err, res) {
            if (err) throw err;
            runSearch(); 
          });
        });
      });//end of then function
};

var addNew = function() {
      inquirer.prompt([
           {
              name: "name",
              message: "Enter the product name."
            }, 
           {
              name: "department",
              message: "Enter the department."
            }, 
            {
              name: "price",
              message: "Enter the price."
            }, 
            {
              name: "quantity",
              message: "Enter the quantity."
            }, 

        ]).then(function (answers) {
          var name = answers.name;
          var price = answers.price;
          var department = answers.department;
          var quantity = answers.quantity;
          connection.query("insert into products set?", {product_name: name, department_name: department, price: price, stock_quantity: quantity}, function(err, res) {
            if (err) throw err;
            runSearch();
          });


    });
};


