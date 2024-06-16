import * as os from "os";

import copy from 'rollup-plugin-copy-glob';
import cjs from "rollup-plugin-cjs-es";
import iife from "rollup-plugin-iife";
// import inline from "rollup-plugin-inline-js";
// import json from "rollup-plugin-json";
import output from "rollup-plugin-write-output";
// import {terser} from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
// import inject from "@rollup/plugin-inject";
//
import {glob} from "glob";

const ip = findIP();

export default {
  input: await glob("src/*.mjs"),
  output: {
    format: "es",
    dir: "dist-extension/",
    intro: `const IP = "${ip}";`
  },
  plugins: [
    resolve(),
    cjs({nested: true}),
    copy([
      {
        files: "src/static/**/*",
        dest: "dist-extension"
      }
    ]),
    iife(),
    output([
      {
        test: /background\.js$/,
        target: "dist-extension/manifest.json",
        handle: (content, {scripts}) => {
          content.background.scripts = scripts;
          return content;
        }
      },
      {
        test: /content\.js$/,
        target: "dist-extension/manifest.json",
        handle: (content, {scripts}) => {
          content.content_scripts[0].js = scripts;
          return content;
        }
      }
    ])
  ]
};

function findIP() {
  const ifaces = os.networkInterfaces();
  for (const dev in ifaces) {
    for (const details of ifaces[dev]) {
      if (details.family === 'IPv4' && !details.internal) {
        return details.address;
      }
    }
  }
  throw new Error("No IP found");
}
