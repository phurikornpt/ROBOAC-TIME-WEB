
exports.getEmp = (req, res) => {
    if( req.session.role === "emp" ){
        res.render('main_page',{
            session_user_id:req.session.user_id,
            session_user:req.session.user,
            session_role:req.session.role,
            header:"Employee"
        });
    }else{
        res.redirect('/');
    }

};