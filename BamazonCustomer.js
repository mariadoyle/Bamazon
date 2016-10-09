var mysql = require('mysql'); 
var inquirer = require('inquirer'); 


var connection = mysql.createConnection(
{
    host: 'localhost', 
    port: 3306, 
    user: 'root', 
    password: 'pelicula4605', 
    database: 'BamazonDB'
}); 


connection.connect(function(err) 
{
    if(err) throw err; 
}); 


var showTable = function()
{
    connection.query('SELECT * FROM products', function(err, response) 
    {
        if (err) throw err;
            console.log('Item ID | Product Name | Department Name | Price | Stock Quantity');
        for (i = 0; i < response.length; i++)
        {
            console.log(response[i].itemId + ' | '  + response[i].productName + ' | '  + response[i].departmentName + ' | '  + response[i].price + ' | ' + response[i].stockQuantity); 
        }
        userPrompt(); 
    }); 
}; 


showTable(); 
 

function userPrompt() 
{
    inquirer.prompt([
    {
        name: "itemId",
        type: "input",
        message: "What is the ID of the product you would like to buy?"
    }, 
    {
        name: "numberOf",
        type: "input",
        message: "How many units of this product would you like to buy?"
    }
    ]).then(function(choice) 
    {
        selectedId = choice.itemId; 
        quantity = choice.numberOf; 

        connection.query ('SELECT stockQuantity, productName, price FROM products WHERE itemId = ' + selectedId,  
            function(err, response)
            {
            var updatedQuantity = response[0].stockQuantity - quantity; 
                if(updatedQuantity < 0)
                {
                    console.log('Insufficient quantity, sorry!'); 
                } 
                else 
                {
                    connection.query('UPDATE products SET ? WHERE ?',
                        [{stockQuantity: response[0].stockQuantity - quantity}, {itemId: selectedId}], 
                        function(err, response){
                            showTable(); 
                        }); 

                    if (quantity === '1') 
                    {
                        console.log('Total cost: $' + (response[0].price * quantity) + ' for buying ' + quantity + ' copies of ' + response[0].productName); 
                    } 
                    else 
                    {
                        console.log('Total cost: $' + (response[0].price * quantity) + ' for buying ' + quantity + ' copies of ' + response[0].productName); 
                    }
                    console.log('Product Bought!');  
                    }
            });
        }); 
}
