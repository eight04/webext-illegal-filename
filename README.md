webext-illegal-filename
====================

This repo contains some experiment result of "Which characters are illegal in downloads.download API" which are used by the extension "Image Picka".

Run the test
------------

1. Install node.js.
2. In the project root, run `npm install`.
3. run `npm run build` to build the extension.
4. Create `config.mjs`.
5. Run `npm start` to start the test.
6. The extension will test ASCII characters from 0~127 for all targets.
7. When a test ends i.e. after testing all 127 chars, the script should close the browser automatically. However, there is [a bug](https://github.com/mozilla/web-ext/issues/1569) preventing Firefox from closing, you may have to close it manually.
8. The result will be saved in `records.json`.
9. Clean up your download folder and repeat from step 4.
10. When all tests are done, run `npm run build-report` to analyze the result.
11. You have to choose a base record to compare with.
12. The result will be saved in `report.md`.

`config.mjs`
-------------

This file should be placed in the project root. Example:

```js
// the download folder. The script uses this folder to generate relative path.
export const downloadFolder = String.raw`C:\Users\eight04\Downloads`;

// an array of objects. Each object should have a `name` property. Other properties will be sent to web-ext runner:
// https://github.com/mozilla/web-ext/blob/a81ddc1c4fb09152ee4efd059643a2312d16e966/src/cmd/run.js#L20
// Usually, you only need to specify `target`, `firefox`, or `chromiumBinary` properties.
export const targets = [
  {
    name: "Firefox 126 + Windows 10",
    target: "firefox-desktop",
    firefox: String.raw`D:\Program Files\FirefoxPortable126\App\Firefox64\firefox.exe`,
  },
  {
    name: "Firefox Nightly 129 + Windows 10",
    target: "firefox-desktop",
    firefox: String.raw`C:\Program Files\Firefox Nightly\firefox.exe`
  },
  {
    name: "Edge 126 + Windows 10",
    target: "chromium",
    chromiumBinary: String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`
  }
];
```

Result
-------

See [report.md](report.md).
