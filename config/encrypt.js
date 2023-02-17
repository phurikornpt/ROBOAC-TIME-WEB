const shaJs = require("sha.js");

module.exports = class Sha{
    static encrypt(input){
        return shaJs('sha256').update(input).digest('hex')
    }
}