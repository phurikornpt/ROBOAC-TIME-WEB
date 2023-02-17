const {Emp_Model,Emp_posiiton_Model} = require('../config/db_config.js')
const sha = require('../config/encrypt')


exports.vertify_login = async (input) => {
    let result = await Emp_Model.findOne({ Emp_Username: input.user , Emp_Password: sha.encrypt(input.pwd) ,Emp_Flag : 1 })
    if(result){
        result = result.toObject();
        let role = await Emp_posiiton_Model.findOne({ id: result.Position_id })
        result.position = role.name;
    }
    return result || ""
};







// exports.get_position = async (input) => {
//     // console.log(input);
//     let result = await EmployeeModel.findOne({ Emp_Username: input.user , Emp_Password: input.pwd })
//     // console.log(result);
//     return result || ""
// };
// const small = new EmployeeModel({ Emp_FName: 'small' ,
//                                         Emp_Flag:await EmployeeModel.find({}).count()+1
//     });

//     small.save(function (err) {
//     if (err) return handleError(err);
//     // saved!
//     });
