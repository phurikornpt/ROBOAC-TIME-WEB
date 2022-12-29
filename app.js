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
    // console.log(req.session.user_id);
    // req.session.user = "admin";
    // req.session.user_id = 11;

    let data = {
        session:{
            user:req.session.user || ''
        }
    }


    res.render('page',{data:data});
})


/* ----------เวลางาน---------- */
var date = new Date();

app.get("/job",function(req,res){
     // Have year and month - ---------------------------------------------------------------------------
    
     const MONTH = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","พฤษภาคม","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
     if(req.session.user == "" ||req.session.user == undefined ){
        res.redirect('/');
    }else{

        function getDaysInMonth(month, year) {
            let dateT = new Date(year, month, 1);
            let days = [];
            while (dateT.getMonth() === month) {
            days.push(new Date(dateT));
            dateT.setDate(dateT.getDate() + 1);
            }
            return days;
        }

        

        

        let now_time = `${date.getFullYear()}-${date.getMonth()+1}`;
        let array_time = now_time.split("-");

        let date_current = getDaysInMonth(date.getMonth(),date.getFullYear())
        // let date_current = getDaysInMonth(10,date.getFullYear())

        

        let data = {
            date:{
                getDay:date.getDate(),
                getMonth:date.getMonth(),
                getNameMonth:MONTH[date.getMonth()],
                getFullMonth:date_current,
                getYear:date.getFullYear()
            },
            session:{
                user:req.session.user || ''
            }
        }
        

        let sql = `SELECT * FROM data where data.user_id = ${req.session.user_id} and data.real_date LIKE '%${now_time}%' ORDER BY data.date`;
        // let sql = `SELECT * FROM data where data.user_id = ${req.session.user_id} order BY data.date`;
        
        con.query(sql,function(err,result){
            if(!err){
                let h = 0;
                let m = 0;
                let allTime = 0;
                let allMoney = 0;
                data["userData"]=result;
                // cal - all time
                for(let i of result){
                    /* getTime[0] = h */
                    /* getTime[1] = m */
                    let getTime = i.time.split(":");
                    h+= parseInt(getTime[0]);
                    m+= parseInt(getTime[1]);
                    
                }
                let s = (h*60) + m;
                h = parseInt(s/60);
                m = s % 60;
                let all = "";
                if(h<10){
                    all += `0${h}`;
                }else{
                    all += `${h}`;
                }
                all+=":";
                if(m<10){
                    all += `0${m}`;
                }else{
                    all += `${m}`;
                }
                data["getAll_time"]=all;
                data["getAll_money"]=h*50;

                res.render('page_job',{data:data});
            }
        })
    }
})

function cal_time(start,stop){
    let start_h = Number(start.substring(0,2));
    let start_m = Number(start.substring(3,start.length));
    let stop_h = Number(stop.substring(0,2));
    let stop_m = Number(stop.substring(3,stop.length));

    let h =0;
    let m =0;

    if(start_h <= stop_h){
        let m1 = (start_h * 60) + start_m;
        let m2 = (stop_h * 60) + stop_m;
        let dis = m2 - m1;
        h = parseInt(dis/60);
        m = dis % 60;

    }else{
        let midni_m = (24*60) - ( (start_h*60) +start_m )
        let m2 =(stop_h * 60) + stop_m
        let s = midni_m + m2
        h = parseInt(s/60)
        m = s % 60
    }
    let result = "";
    if(h<10){
        result += `0${h}`;
    }else{
        result += `${h}`;
    }
    result+=":";
    if(m<10){
        result += `0${m}`;
    }else{
        result += `${m}`;
    }

    return result;
}
app.get("/del",function(req,res){
    let id = req.query.id;
    let sql =`DELETE FROM data WHERE data.id = ${parseInt(id)}`;
    con.query(sql,function(err){
        if(!err){
            console.log("DONE Remove id :"+id);
            res.redirect('/job');
        }
    })


});

app.post('/save_time',function(req,res){
    // Have year and month - ---------------------------------------------------------------------------
    let start = req.body.start;
    let stop = req.body.stop;
    let comment =req.body.comment;
    let month = req.body.month_in;
    let day =req.body.day_in ;
    let time = cal_time(start,stop);

    let date_year = date.getFullYear()+"-"+month+"-"+day;
    sql = ` INSERT INTO data(user_id, start, stop,time,real_date,comment_data,date) VALUES 
    ('${req.session.user_id}' , '${start}' , '${stop}', '${time}', '${date_year}', '${comment}', '${day}') `;
    // sql = ` INSERT INTO data(user_id, start, stop,time,real_date,comment_data,date) VALUES 
    // ('"+req.session.user_id+"' , '"+start+"' , '"+stop+"', '"+time+"', '"+date+"', '"+comment+"', '"+day+"')`;
    con.query(sql,function(err,result){
        if(!err){
            console.log("DONE");
            res.redirect('/job');
        }
    })
    // console.log(start,stop,comment,month,day);


});

/* ----------เวลางาน---------- */


/* ----------ลงทะเบียน---------- */

app.post("/login",function(req,res){
    let user = req.body.user;
    let pass = req.body.pass;
    let sql = "SELECT * FROM user";
    
    con.query(sql,function(err,result){
        let isMatch = false;
        if(!err){
            result.forEach(element => {
                if(user == element.username && pass == element.password ){
                    // console.log(element);
                    req.session.user= element.name;
                    req.session.user_id= element.user_id ;

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
                // console.log(element);
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

/* ----------ลงทะเบียน---------- */

app.listen(3000);