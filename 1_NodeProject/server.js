// Core Modules
const http = require("http");
const PORT = 3000 || process.env.PORT;
const url = require("url");
const fs = require("fs");

//Third party Modules
const slugify = require("slugify");
// Own Modules
const replaceTemplate = require("./JSModules/replaceTemplate");

//SERVER
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);



const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8"); // File was read asynchronously
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugify("Fresh Avocados", { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  console.log(url.parse(req.url, true));
  const { query, pathname } = url.parse(req.url, true);

  // Overview page;
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(templateCard, el))
      .join("");
    const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    //Product page
  } else if (pathname === "/product") {
    // console.log(query)
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(templateProduct, product);

    res.end(output);

    //API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    //Not Found
  } else {
    res.writeHead(404, {
      Content_type: "text/html",
      "my-own-header": "Hello World",
    });
    res.end(`<h1>Page Not Found!!!</h1>`);
  }

  // console.log(url);
  // console.log(req)
});
server.listen(PORT, "127.0.0.1", () => {
  console.log(`Listening on port ${PORT}`);
});
