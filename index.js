const webServer = require('./services/web-service.js');
const dbConfig = require('./config/database.js');
const defaultThreadPoolSize = 4;
const database = require('./services/database.js');
const axios = require('axios')
 
// Increase thread pool size by poolMax
process.env.UV_THREADPOOL_SIZE = dbConfig.hrPool.poolMax + defaultThreadPoolSize;

function gql (query) {
    return new Promise((resolve, reject) => {
      axios({
        url: 'http://200.98.118.125:4000/',
        method: 'POST',
        data: { query },
      }) 
        .then((res) => resolve(res.data['data']))
        .catch((err) => reject(err))
    })
  }

  gql(`
  query{
    clientes{
    nome
    cpf
    }
  }
`)
  .then((data) => console.log(data))
  .catch((err) => console.log(err))
async function startup() {
  console.log('Starting application');
 
  try {
    console.log('Initializing web server module');
 
    await webServer.initialize();
    console.log('Initializing database module');
 
    //await database.initialize(); 
  } catch (err) {
    console.error(err);
 
    process.exit(1); // Non-zero failure code
  }
}
 
startup();

// *** previous code above this line ***
 
async function shutdown(e) {
  let err = e;
    
  console.log('Shutting down');
 
  try {
    console.log('Closing web server module');
 
    await webServer.close();
    console.log('Closing database module');
 
    //await database.close(); 
  } catch (e) {
    console.log('Encountered error', e);
 
    err = err || e;
  }
 
  console.log('Exiting process');
 
  if (err) {
    process.exit(1); // Non-zero failure code
  } else {
    process.exit(0);
  }
}
 
process.on('SIGTERM', () => {
  console.log('Received SIGTERM');
 
  shutdown();
});
 
process.on('SIGINT', () => {
  console.log('Received SIGINT');
 
  shutdown();
});
 
process.on('uncaughtException', err => {
  console.log('Uncaught exception');
  console.error(err);
 
  shutdown(err);
});
