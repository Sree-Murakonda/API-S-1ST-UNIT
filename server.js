var express = require('express');
var app = express();
var fs = require("fs"); 

app.use(express.json());
// const express = require('express');
// const app = express();
const bodyParser = require('body-parser');
// const fs = require('fs');
const path = require('path');

// use body-parser middleware to parse request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// read users data
const usersFilePath = path.join(__dirname, 'users.json');
let usersData = fs.readFileSync(usersFilePath, 'utf-8');
let users = JSON.parse(usersData);

app.get('/listUsers', function (req, res) {
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
        console.log(data);
        res.end(data);
    });
});

app.post('/addUser', function (req, res) {
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
        var users = JSON.parse(data);
        // console.log(req.body);
        var newUser = {
            "name": req.body.name,
            "password": req.body.password,
            "profession": req.body.profession,
            "id": users.users.length + 1
        };
        users.users.push(newUser);
        fs.writeFile(__dirname + "/" + "users.json", JSON.stringify(users), function (err) {
            if (err) throw err;
            console.log('New user added: ' + JSON.stringify(newUser));
            res.end(JSON.stringify(newUser));
        });
    });
});

  

app.delete('/deleteUser/:id', function (req, res) {
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
        var users = JSON.parse(data);
        var userId = req.params.id;
        var user = users.users.find(u => u.id == userId);
        if (!user) {
            res.status(404).send('User not found');
        } else {
            users.users = users.users.filter(u => u.id != userId);
            fs.writeFile(__dirname + "/" + "users.json", JSON.stringify(users), function (err) {
                if (err) throw err;
                console.log('User deleted: ' + JSON.stringify(user));
                res.end(JSON.stringify(user));
            });
        }
    });
});

app.get('/:id', function (req, res) {
    // First read existing users.
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
        var users = JSON.parse(data);
        var userId = req.params.id;
        var user = users.users.find(u => u.id == userId);
        console.log(user);
        if (!user) {
            res.status(404).send('User not found');
        } else {
            res.end(JSON.stringify(user));
        }
    });
});



var server = app.listen(8081, function () {
    var host = "localhost";
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});


