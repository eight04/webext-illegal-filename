import dns from 'dns';
import {createServer} from "http";
import * as path from "path";
import * as fs from "fs/promises";

import readline from "readline-promise";

import webext from "web-ext";

dns.setDefaultResultOrder('ipv4first');

const rl = readline.default.createInterface({
  input: process.stdin,
  output: process.stdout
});

const records = [];

const htmlServer = createServer((req, res) => {
  if (req.url === "/report") {
    let body = "";
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const record = JSON.parse(body);
      if (record.filename) {
        record.filename = path.basename(record.filename);
      }
      console.log(record);
      records.push(record);
      res.end();
    });
  } else {
    res.end();
  }
});
htmlServer.listen(8080);

const options = {
  sourceDir: path.resolve("dist-extension"),
  target: process.argv[2],
  noInput: true,
  noReload: true,
};

// if (options.target === 'firefox-desktop-no-partition') {
//   options.target = 'firefox-desktop';
//   options.pref =   {
//     'privacy.partition.network_state': false
//   };
// }
//
// if (options.target === 'chromium-no-partition') {
//   options.target = 'chromium';
//   options.args = [
//     '--disable-features=SplitCacheByNetworkIsolationKey'
//   ]
// }
//
if (options.target === "firefox-desktop") {
  options.firefox = process.argv[3];
} else {
  options.chromiumBinary = process.argv[3];
}

const runner = await webext.cmd.run(options, {
  shouldExitProgram: false
});

await rl.questionAsync("press Enter to close browser\n");

await runner.exit();

// const rows = [
//   ['Case', 'Status', 'Extra']
// ];
// for (const r of records) {
//   rows.push([
//     r.case,
//     r.status,
//     r.extra,
//   ]);
// }
// console.log(markdownTable(rows));

const name = await rl.questionAsync("Enter name of the record: ");
const data = await fs.readFile(`records.json`, 'utf8');
const o = JSON.parse(data);
o[name] = records;
await fs.writeFile(`records.json`, JSON.stringify(o, null, 2));

htmlServer.close();
rl.close();

