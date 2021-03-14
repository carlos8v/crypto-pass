const readline = require('readline');
const { resolve } = require('path');
const { existsSync } = require('fs');
const { writeFile } = require('fs/promises');

const crypto = require('crypto');
const knex = require('knex');

const { log, error, warn, colour } = require('./cli');

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

function ask(queries) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    let index = 0;
    const answers = [];
    
    rl.setPrompt(queries[index]);
    rl.prompt();

    rl.on('line', (line) => {
      answers.push(line);
      if (index >= queries.length - 1) {
        rl.close();
        resolve(answers);
      } else {
        index++;
        rl.setPrompt(queries[index]);
        rl.prompt();
      }
    })
  })
}

async function createDotEnv() {
  if(existsSync(resolve(__dirname, '..', '.env'))) {
    const [ ans ] = await ask([
      `${colour.yellow}[crypto-pass] You want to override the .env file (y/n): ${colour.black}`,
    ]);
    if (ans !== 'y') return;
  }

  const JWT_SECRET = crypto.createHash('md5')
    .update(Date.now().toString())
    .digest('hex');
  
  const smtp_config = await ask([
    '[crypto-pass] SMTP Host: ',
    '[crypto-pass] SMTP Port: ',
    '[crypto-pass] SMTP Secure (y/n): ',
    '[crypto-pass] SMTP User: ',
    '[crypto-pass] SMTP Pass: ',
  ]);

  try {
    await writeFile(
      resolve(__dirname, '..', '.env'),
      `JWT_SECRET=${JWT_SECRET}\n` +
      'APP_PORT=3000\n' +
      `SMTP_HOST=${smtp_config[0]}\n` +
      `SMTP_PORT=${smtp_config[1]}\n` +
      `SMTP_SECURE=${smtp_config[2] === 'y' ? 'true' : 'false'}\n` +
      `SMTP_USER=${smtp_config[3]}\n` +
      `SMTP_PASS=${smtp_config[4]}\n`,
    );

    log('created .env file in the root directory');
  } catch (err) {
    error('error while creating .env file');
    console.log(err);
  }
}

(async () => {
  warn('initializing the config script');
  await createDotEnv();
  await createDatabase();
  log('default configuration completed\n');
})();
