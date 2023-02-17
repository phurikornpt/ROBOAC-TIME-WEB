const {Client} = require('pg');
// const con = new Client({
//     host: "localhost",
//     user: "postgres",
//     port:5432,
//     password: "phu16821",
//     database: "postgres"
// });
const con = new Client({
    host: "dpg-cen495ta4991ihmotel0-a",
    user: "phurikorn",
    port:5432,
    password: "BYrxbWhK9VaauuiEdwIxOloZI4rQHHHd",
    database: "roboac_2n3v"
});
con.connect();

module.exports = con;


// const con = new Client({
//     host: "singapore-postgres.render.com",
//     user: "phurikorn",
//     port:5432,
//     password: "BYrxbWhK9VaauuiEdwIxOloZI4rQHHHd",
//     database: "roboac_2n3v"
// });
