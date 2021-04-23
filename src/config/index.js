const readline = require('readline');
const { resolve } = require('path');
const { existsSync } = require('fs');
const { writeFile } = require('fs/promises');

const crypto = require('crypto');
const knex = require('knex');

const { log, error, warn, colour } = require('../cli');

async function createDatabase() {
  const config = require('../../knexfile');
  const db = knex(config);
  
  if (existsSync(resolve(__dirname, '..', 'database', 'database.sqlite'))) {
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

  return new Promise((res) => {
    let index = 0;
    const answers = [];
    
    rl.setPrompt(queries[index]);
    rl.prompt();

    rl.on('line', (line) => {
      answers.push(line);
      if (index >= queries.length - 1) {
        rl.close();
        res(answers);
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
  
  const JWT_REFRESH_SECRET = crypto.createHash('md5')
    .update(Date.now().toString() + JWT_SECRET)
    .digest('hex');
  
  const [
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
  ] = await ask([
    '[crypto-pass] SMTP Host: ',
    '[crypto-pass] SMTP Port: ',
    '[crypto-pass] SMTP Secure (y/n): ',
    '[crypto-pass] SMTP User: ',
    '[crypto-pass] SMTP Pass: ',
  ]);

  try {
    await writeFile(
      resolve(__dirname, '..', '..', '.env'),
      'APP_PORT=3000\n\n' +
      `JWT_SECRET=${JWT_SECRET}\n` +
      `JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}\n\n` +
      `SMTP_HOST=${SMTP_HOST}\n` +
      `SMTP_PORT=${SMTP_PORT}\n` +
      `SMTP_SECURE=${SMTP_SECURE === 'y' ? 'true' : 'false'}\n` +
      `SMTP_USER=${SMTP_USER}\n` +
      `SMTP_PASS=${SMTP_PASS}\n`,
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
