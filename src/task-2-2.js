import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream';
import { fileURLToPath } from 'node:url';

import csv from 'csvtojson';

// uncomment these variables if you run the code without Babel
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

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
