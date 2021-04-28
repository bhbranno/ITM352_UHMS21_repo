// Author: Ben Brannon
// This is the server that will allow for the login and registration forms to be validated, and to add new users to the database
// As well as check current users against the DB to let them log in

// code taken from Lab 13

var express = require('express');
var app = express();
var myParser = require("body-parser");
app.use(myParser.urlencoded({ extended: true }));
var qs = require('querystring');
var fs = require('fs');
const QueryString = require('qs');




// Code taken from lab 14
// Read user data file
var user_data_file = './user_data.json';
if (fs.existsSync(user_data_file)) {
    var file_stats = fs.statSync(user_data_file);
    console.log(`${user_data_file} has ${file_stats["size"]} characters`);
    var user_data = JSON.parse(fs.readFileSync('./user_data.json', 'utf-8'));
} else {
    console.log(`${user_data_file} does not exist!`);
}



app.all('*', function (request, response, next) {
    console.log(request.method, request.path);
    next();
});



// Process login
app.post('/process_login', function (request, response, next) {
    // Check login and password match database
    let username_entered = request.body["username"];
    let password_entered = request.body["password"];
    if (typeof user_data[username_entered] != 'undefined') {
        if (user_data[username_entered]['password'] == password_entered) {
            request.query["username"] = request.body["username"];
            // If good, send to invoice
            response.redirect('invoice.html?' + qs.stringify(request.query));
        } else {
            response.send(`${username_entered} password is wrong, please go back and try again`)
        }
    } else {
        response.redirect('login_page.html?' + qs.stringify(request.query));
    }
});

// Process Registration
// Part of this code was taken from examples from classmates, including Jacob Graham
app.post('/process_register', function (request, response, next) {
    query_string = request.body;
    console.log(query_string);
    var errors = [];
    // character limitations for Full Name
    if (/^[a-zA-Z_ ]+$/.test(request.body.name)) {
    }
    else {
        errors.push('Please follow the format for names! (ex. John Smith)')
    }
    // If the entered name is empty, return an error
    if (request.body.name == "") {
        errors.push('The full name inputted is invalid.');
    }
    // Set a maximum fullname length of 30
    if ((request.body.name.length > 30 && request.body.name.length < 0)) { // Output errors if the name is too long
        errors.push('Sorry! That name is too long.')
    }
    // Check to see that the newly registered username is lower case
    var reg_user = request.body.username.toLowerCase();
    if (typeof user_data[reg_user] != 'undefined') { // Output errors if name is taken
        errors.push('Sorry! That username is taken.')
    }
    // Setup character limitations (Letters and numbers only for username)
    if (/^[0-9a-zA-Z]+$/.test(request.body.username)) {
    }
    else {
        errors.push('Please use only letters and numbers for your username.')
    }

    // Setup email limitations (from w3resource https://www.w3resource.com/javascript/form/email-validation.php)
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(request.body.email)) {
    }
    else {
        errors.push('Please use a valid email format (ex. johnsmith@gmail.com)')
    }

    // Make password a minimum of six characters
    if (request.body.password.length < 8) {
        errors.push('Your password is too short (Please use at least 8 characters).')
    }
    // Check to see if the passwords match
    if (request.body.password !== request.body.confirm_password) {
        errors.push('Your passwords do not match.')
    }

    // Request fullname, username, and email
    request.query.name = request.body.name;
    request.query.username = request.body.username;
    request.query.email = request.body.email;


    // Add registration info to database
    if (errors.length == 0) {
        console.log('no errors');
        username = request.body["username"];
        user_data[username] = {};
        user_data[username].name = request.body["name"];
        user_data[username].password = request.body["password"];
        user_data[username].email = request.body["email"];

        //write data into database

        fs.writeFileSync(user_data_file, JSON.stringify(user_data));

        // After register, send to invoice
        response.redirect('./invoice.html?' + qs.stringify(request.query));
    } else {
        console.log(errors);
        request.query.errors = errors.join(';');
        response.redirect('./registration_page.html?' + QueryString.stringify(request.query));
    }
});


app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));