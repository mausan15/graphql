const oracledb = require('oracledb');
const dbConfig = require('../config/database.js');
 
async function initialize() {
  const pool = await oracledb.createPool(dbConfig.hrPool);
}
 
module.exports.initialize = initialize;

// *** previous code above this line ***
 
async function close() {
    await oracledb.getPool().close();
  }
   
  module.exports.close = close;

// *** previous code above this line ***
   
  function simpleExecute(statement, binds = [], opts = {}) {
    return new Promise(async (resolve, reject) => {
      let conn;
   
      opts.outFormat = oracledb.OBJECT;
      opts.autoCommit = true;
   
      try {
        conn = await oracledb.getConnection();
   
        const result = await conn.execute(statement, binds, opts);
   
        resolve(result);
      } catch (err) {
        reject(err);
      } finally {
        if (conn) { // conn assignment worked, need to close
          try {
            await conn.close();
          } catch (err) {
            console.log(err);
          }
        }
      }
    });
  }
   
  module.exports.simpleExecute = simpleExecute;