const colour = {
  red: '\x1B[31m',
  yellow: '\x1B[33m',
  green: '\x1B[32m',
  black: '\x1B[39m',
};

module.exports = {
  log: (str) => console.log(`${colour.green}[crypto-pass] ${str}${colour.black}`),
  error: (str) => console.log(`${colour.red}[crypto-pass] ${str}${colour.black}`),
  warn: (str) => console.log(`${colour.yellow}[crypto-pass] ${str}${colour.black}`),
};
