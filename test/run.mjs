import * as path from "path";
import webext from "web-ext";
import * as PT from "promise-toolbox";
import * as fs from "fs/promises";
import assert from "assert";

import isSubdir from "is-subdir";

import {downloadFolder, targets} from "../config.mjs";

import cases from "./cases.mjs";
import {buildReport} from "./build-report.mjs";
import {openServer} from "./server.mjs";

const defaultRunOptions = {
  sourceDir: path.resolve("dist-extension"),
  noInput: true,
  noReload: true,
};
const result = [];

await openServer(cases, async server => {
  for (const {name, ...options} of targets) {
    console.log(`\nTesting ${name}...`);
    const runner = await webext.cmd.run({...defaultRunOptions, ...options}, {
      shouldExitProgram: false
    });
    const records = await PT.fromEvent(server, 'records-end');
    result.push({
      name,
      records
    });
    console.log("Closing browser...");
    await runner.exit();
    console.log("Cleanup downloads...");
    for (const record of records) {
      if (record.filename) {
        assert(isSubdir.strict(downloadFolder, record.filename));
        await fs.unlink(record.filename);
      }
    }
    server.emit("records-reset");
  }
});

console.log("Building report...")
await buildReport(result, downloadFolder);

