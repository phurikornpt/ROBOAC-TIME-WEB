
const con = require('../config/db_config');
const cal_time = require('../config/cat_time');
const getDate = require('../config/getDate');
var date = new Date();


exports.logout = (req, res) => {
    req.session.destroy(function(err){});
    res.redirect('/');
};


// function test(){
//     let sql = "SELECT name,username FROM public.user";
//     con.query(sql,function(err,result){
//         if(!err){
//             console.log(result);
//         }
//     })
// }

exports.getRoot = (req, res) => {
    // test()
    let data = {
        session:{
            user:req.session.user || ''
        }
    }
    res.render('page',{data:data});
};


exports.login = (req, res) => {
    let user = req.body.user;
    let pass = req.body.pass;
    let sql = "SELECT  * from public.user ";

    con.query(sql,function(err,result){
        let isMatch = false;
        if(!err){
            result.rows.forEach(element => {
                console.log(element);
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
        }else{
            res.send({status:5});
        }
    })
};

exports.register = (req, res) => {
    let name = req.body.name;
    let user = req.body.user;
    let pass = req.body.pass;
    let sql = "SELECT name,username FROM public.user";
    let isMatch = false;
    con.query(sql,function(err,result){

        if(!err){
            
            for(let element of result.rows){
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
                sql = "INSERT INTO public.user( name , username, password,role) VALUES ('"+name+"' , '"+user+"' , '"+pass+"','u')";
                con.query(sql,function(err){
                    console.log(err);
                    if(!err){
                        console.log("DONE");
                        res.send({status:"done"});
                    }
                })
            }
            
        }
    })
};

exports.save_time = (req, res) => {
    // Have year and month - ---------------------------------------------------------------------------
    let start = req.body.start;
    let stop = req.body.stop;
    let comment =req.body.comment;
    let month = req.body.month_in;
    let day =req.body.day_in ;
    let time = cal_time(start,stop);

    let date_year = date.getFullYear()+"-"+month+"-"+day;
    console.log(day);
    sql = ` INSERT INTO public.data(user_id, start, stop,time,real_date,comment_data,date) VALUES 
    ('${req.session.user_id}' , '${start}' , '${stop}', '${time}', '${date_year}', '${comment}', '${day}') `;
    // sql = ` INSERT INTO data(user_id, start, stop,time,real_date,comment_data,date) VALUES 
    // ('"+req.session.user_id+"' , '"+start+"' , '"+stop+"', '"+time+"', '"+date+"', '"+comment+"', '"+day+"')`;
    con.query(sql,function(err){
        if(!err){
            console.log("DONE");
            res.redirect('/job');
        }
    })
};
exports.del = (req, res) => {
    let id = req.query.id;
    let sql =`DELETE FROM public.data WHERE data.id = ${parseInt(id)}`;
    con.query(sql,function(err){
        if(!err){
            console.log("DONE Remove id :"+id);
            res.redirect('/job');
        }
    })
};
exports.job = (req, res) => {
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
               getYear:date.getFullYear(),
               getDate:getDate.date(),
               getTime:getDate.currentTime(),

           },
           session:{
               user:req.session.user || ''
           }
       }
       

       let sql = `SELECT * FROM public.data where data.user_id = ${req.session.user_id} and data.real_date LIKE '%${now_time}%' ORDER BY data.date`;
       // let sql = `SELECT * FROM data where data.user_id = ${req.session.user_id} order BY data.date`;
       
       con.query(sql,function(err,result){
           
           if(!err){
               let h = 0;
               let m = 0;
               let allTime = 0;
               let allMoney = 0;
               data["userData"]=result.rows || [];
               // cal - all time
               // console.log(result);
               for(let i of result.rows){
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
};


exports.oldtime = (req, res) => {
    // Have year and month - ---------------------------------------------------------------------------
    
    const MONTH = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","พฤษภาคม","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
    if(req.session.user == "" ||req.session.user == undefined ){
       res.redirect('/');
   }else{
        
        if(req.query.month === undefined){
            let data = {
                session:{
                    user:req.session.user || ''
                }
            }
            res.render('oldtime',{data:data});

        }else{

            // console.log(req.query.month);

            let now_time = req.query.month;
            let split = now_time.split('-')
            if(split[1][0] == "0"){
                split[1]=split[1][1]
                now_time = split[0]+"-"+split[1]
            }
            console.log(split);
            
            let data = {
                date:{
                    getDay:date.getDate(),
                    getMonth:date.getMonth(),
                    getNameMonth:MONTH[Number(split[1])-1],
                    getYear:date.getFullYear(),
                    getDate:getDate.date(),
                    getTime:getDate.currentTime(),
                    getNow:req.query.month
                },
                session:{
                    user:req.session.user || ''
                }
            }
            
     
            let sql = `SELECT * FROM public.data where data.user_id = ${req.session.user_id} and data.real_date LIKE '%${now_time}%' ORDER BY data.date`;
            // let sql = `SELECT * FROM data where data.user_id = ${req.session.user_id} order BY data.date`;
            
            con.query(sql,function(err,result){
                if(!err){
                    // console.log(result);

                    let h = 0;
                    let m = 0;
                    let allTime = 0;
                    let allMoney = 0;
                    data["userData"]=result.rows || [];
                    // cal - all time
                    // console.log(result);
                    for(let i of result.rows){
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
                    // console.log(data);
                    res.render('oldtime',{data:data});
                }
            })
        }
       
   }
    
};
