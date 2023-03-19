
const { Client } = require('pg')
const client = new Client({
    user: 'phurikorn',
    host: 'singapore-postgres.render.com',
    database: 'roboac_2n3v',
    password: 'BYrxbWhK9VaauuiEdwIxOloZI4rQHHHd',
    port: 5432
})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
