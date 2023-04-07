var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var mongoose = require('mongoose');
mongoose.set('strictQuery', false);
//mongoose.set('strictQuery', true);

//Cookie
const cookieParser = require('cookie-parser');
app.use(cookieParser());

var fs = require("fs");
var server = require("http").Server(app);
server.listen( process.env.PORT || 3000);
io = require("socket.io")(server);
app.io = io;

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

loadConfigFile('config.json');

// Functions
function loadConfigFile(file){
    var obj;
    fs.readFile(file, 'utf8', function(err, data){
        if(err) throw err;
        obj = JSON.parse(data);
        
        var dbString = obj.connectionString;
        mongoose.connect(dbString, function(e){
            if(e){
                console.log(e);
            }else{
                console.log("Mongodb has been connected successfully.");
                require("./routes/main")(app, obj, randomString, obj.secretTokenNo);
                require("./routes/administrator")(app, obj, randomString, obj.secretTokenNo);
            }
        });
        
    });

}


function randomString(length){
    var result = "";
    var array = ["a", "A", "b", "B", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "y", "w", "t", "u", "v", "z", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for(var i=1; i<=length; i++){
        result += array[Math.floor(Math.random() * array.length)];
    }
    return result;
}
