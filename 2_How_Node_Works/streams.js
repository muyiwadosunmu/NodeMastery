const fs = require('fs');
const server = require('http').createServer();
const PORT = 3000;

server.on('request', (req, res) => {
  //Solution 1 (NOT EFFICIENT)
  //   fs.readFile(`${__dirname}/test-file.txt`, (err, data) => {
  //     if (err) console.log(err.message);
  //     res.end(data);
  //    });
  //Solution 2 -Using Streams NB- we need to make use of data and end as the events
  //   const readable = fs.createReadStream(`${__dirname}/test-file.txt`);
  //   readable.on('data', (chunk) => {
  //     res.write(chunk);
  //   });
  //   readable.on('end', () => {
  //     res.end();
  //   });
  //   readable.on('error', (err) => {
  //     console.log(err);
  //     res.statusCode = 500;
  //     res.end(`File not Found`);
  //   });
  // The solution 2 (reading over network) is even slow as compared to reading directly from the disk, this will lead to a term caled back-pressure, a scenario at which the the writable stream cannot handle the overwhelming incoming data, th response cannot send the data so fast as it is receiving it from the file

  const readable = fs.createReadStream(`${__dirname}/test-file.txt`);
  readable.pipe(res);
  // Solution 3 - using pipe function - Alows us to pipe the output of a readable Stream to the input of a writable Steram
  //readableSource.pipe(writableDest);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on PORT ${PORT}`);
});
