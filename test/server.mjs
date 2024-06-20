import dns from 'dns';
import {createServer} from "http";

dns.setDefaultResultOrder('ipv4first');

export async function openServer(cases, callback) {
  const records = [];
  const htmlServer = createServer((req, res) => {
    if (req.url === "/report") {
      let body = "";
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const record = JSON.parse(body);
        console.log(record);
        records.push(record);
        res.end();

        if (records.length >= cases.length) {
          htmlServer.emit('records-end', records.slice());
        }
      });
    } else if (req.url === "/cases") {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(cases));
    } else {
      res.end();
    }
  });
  htmlServer.listen(8080);
  htmlServer.on('records-reset', () => {
    records.length = 0;
  });

  try {
    await callback(htmlServer);
  } finally {
    htmlServer.close();
  }
}

