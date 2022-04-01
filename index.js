//const fetch = require('node-fetch');
let express = require("express");
const bodyParser = require('body-parser');
let port = process.env.PORT || 7070


let server = express();

server.use(bodyParser.json());
server.use(express.static(__dirname + '/site'));

server.get('*', async (req, res) => {
    res.redirect('/')
})

server.listen(port, async () => {
    console.log("Server running on port " + port)
    console.log(`http://localhost:${port}`)
});