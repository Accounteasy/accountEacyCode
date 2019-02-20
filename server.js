var express = require('express'),
	app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    User = require('./api/models/webservicesModel');

global.__basedir = __dirname;

require('./api/uploadImg/upload.multipartfile.js')(app);

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://127.0.0.1:27017/accountEasy", { useNewUrlParser: true });


app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb', extended: true }));
app.use(express.static('uploads'));


var routes = require('./api/routes/webservicesRoutes'); //importing route
routes(app); //register the route

app.listen(port);


console.log('Account Easy server started on: ' + port);