const {Client} = require('pg');

// const con = new Client({
//     host: "localhost",
//     user: "postgres",
//     port:5432,
//     password: "phu16821",
//     database: "postgres"
// });
const con = new Client({
    connectionString: "postgres://ifdadmpmdjobtt:476752290c035f25a720d3e20620257e2425aa47dbf953845c515093f2cf35e2@ec2-3-208-74-199.compute-1.amazonaws.com:5432/den1uejs8q3juo",
    ssl: {
      rejectUnauthorized: false
    }
  });
// const con = new Client({
//     host: "ec2-3-208-74-199.compute-1.amazonaws.com",
//     user: "ifdadmpmdjobtt",
//     port:5432,
//     password: "476752290c035f25a720d3e20620257e2425aa47dbf953845c515093f2cf35e2",
//     database: "den1uejs8q3juo"
// });

// const con = new Client({
//     host: "dpg-cen495ta4991ihmotel0-a.singapore-postgres.render.com",
//     user: "phurikorn",
//     port:5432,
//     password: "BYrxbWhK9VaauuiEdwIxOloZI4rQHHHd",
//     database: "roboac_2n3v",
//     region:"Singapore (Southeast Asia)"
// });
con.connect();

module.exports = con;



