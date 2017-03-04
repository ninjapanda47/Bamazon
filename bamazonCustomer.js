var mysql = require("mysql");
var inquirer = require('inquirer');
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "Bamazon"
});

connection.connect(function(err) {
    if (err) throw err;

});

var ask = function() {
    inquirer.prompt([{
        type: "confirm",
        name: "buy",
        message: "Do you want to purchase an item?"
    }]).then(function(answers) {
        if (answers.buy === true) {
            transaction();
        } else {
            console.log("Maybe next time!");
        }
    });
}

//function to show list of item
var availableItems = function() {
    connection.query('select * from products', function(err, res) {
        if (err) throw err;
        console.table(res);
        ask();
    });
}

availableItems();


//function to run the transaction
var transaction = function() {

    inquirer.prompt([{
            name: "id",
            message: "Enter the id of the item you would like to buy."
        }, {
            name: "quantity",
            message: "Enter the quantity."
        },

    ]).then(function(answers) {
        id = answers.id;
        quantity = answers.quantity;

        connection.query("select stock_quantity, price from products where ?", {
            item_id: id
        }, function(err, res) {
            if (err) throw err;

            var stock_quantity = res[0].stock_quantity;
            var price = res[0].price;

            if (stock_quantity < quantity) {
                console.log("Insufficient quantity!");
            } else {
                newQuantity = stock_quantity - quantity;
                connection.query("update products set ? where ?", [{
                    stock_quantity: newQuantity
                }, {
                    item_id: id
                }], function(err, res) {
                    if (err) throw err;
                    showTotal(quantity, price);

                });
            }
        });

    });
}

var showTotal = function(quantity, price) {
    var total = quantity * price;
    console.log("your total purchase is " + total);
}