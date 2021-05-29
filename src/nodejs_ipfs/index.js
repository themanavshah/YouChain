const express = require('express');
const morgan = require('morgan');
const routes = require('./routes.js');
//const ipfsClient = require('ipfs-http-client').create;
const bodyParser = require('body-parser');

//const ipfs = new ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' });
const app = express();



if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//console.log(typeof ipfsClient);
app.use(bodyParser.urlencoded({ extended: true }))
app.use(routes);

const PORT = process.env.PORT || 6969;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`))