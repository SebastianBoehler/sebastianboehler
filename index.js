const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(__dirname + '/site'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/site/index.html');
})

app.get('/projects', function (req, res) {
    res.sendFile(__dirname + '/site/projects.html');
})

app.get('/contact', function (req, res) {
    res.sendFile(__dirname + '/site/contact.html');
})

http.createServer(app).listen(8080, () => {
    console.log('Express server listening on port 8080');
});