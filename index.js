
const path = require('path');

const express = require('express');
const body = require('body-parser');
const session =require('express-session')

const app = express();

app.use(express.static('public'));
app.use("/axios",express.static('node_modules/axios/dist'));
app.use(body.urlencoded({extended:true}));
app.set('view engine','ejs');

app.use(session({
    secret:'id',
    resave:false,
    saveUninitialized:false
}))

const routes = require('./routes/route');

app.use('/',routes);

let port = process.env.PORT;
if (port ==null || port ==""){
    port = 3000;
}
app.listen(port,()=>{
    console.log("server running good at "+port);
});
