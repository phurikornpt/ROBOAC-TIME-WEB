const express = require('express');
const body = require('body-parser');
const session =require('express-session')
const mysql = require('mysql');
const app = express();



app.use(session({
    secret:'id',
    resave:false,
    saveUninitialized:false
}))
app.use(express.static('public'));
app.use("/axios",express.static('node_modules/axios/dist'));
app.use(body.urlencoded({extended:true}));
app.set('view engine','ejs');


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "roboac"
});
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.get("/",function(req,res){
    // for test UI
    // req.session.user = "HOHO"

    let data = {
        session:{
            user:req.session.user || ''
        }
    }
    res.render('page',{data:data});
})
app.get("/job",function(req,res){
    // for test UI
    req.session.user = "HOHO"
    let data = {
        session:{
            user:req.session.user || ''
        }
    }
    res.render('page_job',{data:data});
})

app.post("/login",function(req,res){
    let user = req.body.user;
    let pass = req.body.pass;
    let sql = "SELECT * FROM user";
    
    con.query(sql,function(err,result){
        let isMatch = false;
        if(!err){
            result.forEach(element => {
                if(user == element.username && pass == element.password ){
                    console.log(element);
                    req.session.user= element.name ;
                    res.send({status:1});
                    isMatch = true;
                }
            });
            if ( isMatch == false){
                res.send({status:0});
            }
        }
    })
})

app.post("/register",function(req,res){
    let name = req.body.name;
    let user = req.body.user;
    let pass = req.body.pass;
    let sql = "SELECT name,username FROM user";
    let isMatch = false;
    con.query(sql,function(err,result){
        if(!err){
            
            for(let element of result){
                console.log(element);
                if(user == element.username){
                    res.send({status:"username"});
                    isMatch = true;
                    break;
                }else if(name == element.name){
                    res.send({status:"name"});
                    isMatch = true;
                    break;
                }
            }
            if( isMatch == false ){
                sql = "INSERT INTO user(name, username, password) VALUES ('"+name+"' , '"+user+"' , '"+pass+"')";
                con.query(sql,function(err,result){
                    if(!err){
                        console.log("DONE");
                        res.send({status:"done"});
                    }
                })
            }
            
        }
    })

    
})


app.post("/logout",function(req,res){

    req.session.user =undefined;
    res.redirect('/')
})


app.listen(3000);