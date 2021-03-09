const { resolve } = require('path');
const { existsSync } = require('fs');
const { writeFile } = require('fs/promises');

const crypto = require('crypto');
const knex = require('knex');

const { log, error, warn } = require('./cli');

async function createDatabase() {
  const config = require('../knexfile');
  const db = knex(config);
  
  if (existsSync(resolve(__dirname, 'database', 'database.sqlite'))) {
    warn('database was dropped');
    await db.migrate.rollback();
  }
  
  await db.migrate.latest();
  log('database was created successfully');
  db.destroy();
}

async function createDotEnv() {
  if(!existsSync(resolve(__dirname, '..', '.env'))) {
    const JWT_SECRET = crypto.createHash('md5')
      .update(Date.now().toString())
      .digest('hex');
    
    try {
      await writeFile(
        resolve(__dirname, '..', '.env'),
        `JWT_SECRET=${JWT_SECRET}\n` +
        'PORT=3000',
      );
  
      log('created .env file in the root directory');
    } catch (err) {
      error('error while creating .env file');
      console.log(err);
    }
  }
}

(async () => {
  warn('initializing the config script');
  await createDotEnv();
  await createDatabase();
  log('default configuration completed\n');
})();
