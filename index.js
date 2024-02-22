// const http = require("http");
// const fs = require("fs");
// const qs = require("querystring");

// const server = http.createServer(function (req, res) {
//   console.log(req);
//   res.end(`
//     <html>
//           <head>
//           <title>Books</title>
//           </head>
//           <body>
//             <form action="/books" method="POST">
//               <input type="text" name="title"/> <br/>
//               <input type="text" name="auther"/> <br/>
//               <button type="submit">Click</button>
//             </form>
//           </body>
//     </html> 
//   `);
//   if (req.url === "/books" && req.method === "POST") {
//     const body = [];
//     req.on("data", (chunk) => {
//       body.push(chunk);
//     });
//     req.on("end", () => {
//       const book = JSON.parse(JSON.stringify(qs.parse(body)));
//       const currentBooks = Object.values(book);
//       currentBooks.push(book);
//       fs.writeFileSync("./books.json", JSON.stringify(currentBooks), (err) => {
//         console.log("Malumot yuborishda xatolik bor 30");
//         if (err) {
//           console.error(err);
//           return res.end("Error Paydo bo'ldi ");
//         }
//         res.writeHead(201);
//         res.end();
//       });
//       const booksFile = fs.openSync("./books.json", "r");
//       fs.closeSync(booksFile);
//     });
//   }
// });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, (err) => {
//   if (!err) {
//     console.log("Listen...", PORT);
//   } else {
//     console.log(err.message);
//   }
// });
const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const { v4: uuidv4 } = require('uuid');

const server = http.createServer(function (req, res) {
  if (req.url === "/books" && req.method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      const formData = Buffer.concat(body).toString();
      const book = qs.parse(formData);
      book.id = uuidv4(); // Add a unique id for the book
      fs.readFile("./books.json", (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }
        const currentBooks = JSON.parse(data);
        currentBooks.push(book);
        fs.writeFile("./books.json", JSON.stringify(currentBooks), (err) => {
          if (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
          }
          res.writeHead(201, { 'Content-Type': 'text/plain' });
          res.end('Book added successfully');
        });
      });
    });
  } else {
    res.end(`
      <html>
        <head>
          <title>Books</title>
        </head>
        <body>
          <form action="/books" method="POST">
            <input type="text" name="title"/> <br/>
            <input type="text" name="author"/> <br/>
            <button type="submit">Click</button>
          </form>
        </body>
      </html> 
    `);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, (err) => {
  if (!err) {
    console.log("Listen...", PORT);
  } else {
    console.log(err.message);
  }
});
