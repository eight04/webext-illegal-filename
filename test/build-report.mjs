import * as fs from "fs/promises";
import * as path from "path";
import {markdownTable} from 'markdown-table';

export async function buildReport(allData, downloadFolder) {
  const output = [];
  const baseData = allData.shift();
  const baseMap = new Map(baseData.records.map(c => [c.case, c]));
  output.push(`### ${baseData.name} (base data)`);
  output.push("Invalid ranges:");
  for (const range of findInvalidRanges(baseData.records)) {
    if (range[0] === range[1]) {
      output.push(`* ${range[0]}`);
    } else {
      output.push(`* ${range[0]} - ${range[1]}`);
    }
  }

  for (const data of allData) {
    // compare to base
    const rows = [[`Case`, `Result`, `Base result`]];
    for (const c of data.records) {
      const base = baseMap.get(c.case);
      if (Boolean(base.err) !== Boolean(c.err) || base.filename !== c.filename) {
        rows.push([
          c.case,
          c.err || path.relative(downloadFolder, c.filename),
          base.err || path.relative(downloadFolder, base.filename)
        ]);
      }
    }
    output.push([`### ${data.name}`]);
    output.push(markdownTable(rows));
  }

  await fs.writeFile(`report.md`, output.join("\n"));
}

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

