const { Transform, pipeline } = require('stream');

class ReverseStream extends Transform {
  _transform(data, _, callback) {
    const string = data.toString();
    const arrOfChars = [...string.slice(0, -2)];
    const reversedString = arrOfChars.reverse().join('');

    this.push(reversedString + '\n\n');

    callback();
  }
}

pipeline(
  process.stdin,
  new ReverseStream({ highWaterMark: 0 }),
  process.stdout,
  (error) => {
    if (error) console.error(`Error: ${error.message}`);
  }
);

// 2nd option:
// process.stdin.on('data', (data) => {
//   console.log([...data.toString().slice(0, -2)].reverse().join('') + '\n\n');
// });
