const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');
const filePath = path.join(__dirname, 'output.txt');
const outputStream = fs.createWriteStream(filePath, { flags: 'a' });
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Welcome! Enter a text. (Type "exit" or press Ctrl+C or Ctrl+D for exit):');

const handleInput = (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('\nGoodbuy!');
    rl.close();
    process.exit(0);
  } else {
    outputStream.write(`${input}\n`);
    console.log('Success! Enter next text. (Type "exit" or press Ctrl+C or Ctrl+D for exit):');
  }
};

rl.on('line', handleInput);
rl.on('close', () => {
  outputStream.end();
});

process.on('SIGINT', () => {
  console.log('\nGoodbuy!');
  rl.close();
  process.exit(0);
});
