const fs = require('node:fs');
const path = require('node:path');
const { pipeline } = require('node:stream');

const csv = require('csvtojson');

const csvFilePath = path.join(__dirname, 'csv', 'csv.csv');
const txtFilePath = path.join(__dirname, 'txt', 'txt.txt');

const writableStream = fs.createWriteStream(txtFilePath, 'utf-8');

const parseCommaSeparatedNumber = (data) => {
  const isDataValidNumber = isFinite(+data);

  if (isDataValidNumber) {
    return +data;
  }

  const arrOfChars = [...data];
  const indexOfComma = arrOfChars.indexOf(',');

  if (indexOfComma >= 0) {
    arrOfChars[indexOfComma] = '.';
    return +arrOfChars.join('');
  }

  return data;
};

const makeKeysLowerCase = (data) => {
  Object.entries(data).forEach(([key, _]) => {
    const arrOfChars = [...key];
    const lowerCaseKey = arrOfChars.map((char) => char.toLowerCase()).join('');

    Object.defineProperty(
      data,
      lowerCaseKey,
      Object.getOwnPropertyDescriptor(data, key)
    );

    delete data[key];
  });
};

pipeline(
  csv({
    checkType: true,
    colParser: {
      Price: parseCommaSeparatedNumber,
    },
  })
    .fromFile(csvFilePath)
    .subscribe(makeKeysLowerCase),
  writableStream,
  (error) => {
    if (error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.log('txt.txt was created ./src/txt/txt.txt');
    }
  }
);
