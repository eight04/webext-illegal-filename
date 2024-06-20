import * as fs from "fs/promises";
import {markdownTable} from 'markdown-table';
import readline from "readline-promise";

const data = await fs.readFile(`records.json`, 'utf8');
const obj = JSON.parse(data);

const rl = readline.default.createInterface({
  input: process.stdin,
  output: process.stdout
});

const base = await rl.questionAsync(`Choose a base record (${Object.keys(obj).join(", ")}): `);
const output = [];

const baseMap = new Map(obj[base].map(c => [c.case, c]));
output.push(`### ${base}`);
output.push("Invalid ranges:");
for (const range of findInvalidRanges(obj[base])) {
  output.push(`* ${range[0]} - ${range[1]}`);
}

for (const key in obj) {
  if (key === base) {
    continue;
  }
  // compare to base
  const rows = [[`Case`, `Compare to ${base}`]];
  for (const c of obj[key]) {
    const base = baseMap.get(c.case);
    if (Boolean(base.err) !== Boolean(c.err) || base.filename !== c.filename) {
      rows.push([c.case, `${c.err || c.filename} vs. ${base.err || base.filename}`]);
    }
  }
  output.push([`### ${key}`]);
  output.push(markdownTable(rows));
}

fs.writeFile(`report.md`, output.join("\n"));

rl.close();

function findInvalidRanges(arr) {
  const ranges = [];
  let start = null;
  let end = null;
  for (const c of arr) {
    if (c.err) {
      if (start === null) {
        start = c.case;
      }
      end = c.case;
    } else {
      if (start !== null) {
        ranges.push([start, end]);
        start = end = null;
      }
    }
  }
  if (start !== null) {
    ranges.push([start, end]);
  }
  return ranges;
}

