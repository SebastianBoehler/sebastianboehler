const http = require('http');
const https = require('https')
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const fs = require('fs');

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  }

const port = process.env.PORT || 80

let transporter = nodemailer.createTransport({
    host: "smtp.strato.de",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'contact@sebastian-boehler.com',
        pass: 'Verwaltung+10'
    }
})

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

app.get('*', function (req, res) {
    res.redirect('/')
})

app.post('/email', async function (req, res) {
    const body = req.body
    await transporter.sendMail({
            from: 'contact@sebastian-boehler.com', // sender address
            to: ['contact@sebastian-boehler.com', 'basti.boehler@hotmail.de'], // list of receivers
            subject: "Contact Form", // Subject line
            text: `Name: ${body['name']}\nEmail: ${body['email']}\nMessage: ${body['message']}`
            //html: email// html body
        })
        .then(data => {
            console.log(data)
            res.send({
                status: 'success'
            })
        })
        .catch(e => {
            console.log(e)
            res.send({
                status: 'failed'
            })
        })
})


http.createServer(app).listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});