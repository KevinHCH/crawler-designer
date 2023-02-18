const http = require("http");
const { URL, URLSearchParams } = require('url');
const { getContent, fixRelativeLinks, isValidURL } = require('./utils');
const PORT = 3000;
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');//here should be your domain

  const url = new URL(req.url, `http://${req.headers.host}/`);
  const query = new URLSearchParams(url.search);
  const targetUrl = query.get('url') || null;
  if (!isValidURL(targetUrl)) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end("Error 400: No valid URL provided");
    return;
  }
  // const targetUrl = 'https://www.w3schools.com/html'

  getContent(targetUrl)
    .then((body) => {
      const html = fixRelativeLinks(body, targetUrl);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    })
    .catch((error) => {
      console.log(error)
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end('Error: 500: Internal Server Error');
    })
});

server.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});