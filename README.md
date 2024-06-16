webext-illegal-filename
====================

This repo contains some experiment result of "Which characters are illegal in downloads.download API" which are used by the extension "Image Picka".

Run the test
------------

1. Install node.js.
2. In the project root, run `npm install`.
3. run `npm run build` to build the extension.
4. According to the browser you want to test, run either:
   ```
   node run.mjs firefox-desktop <path_to_executable>
   ```
   or 
   ```
   node run.mjs chromium <path_to_executable>
   ```
5. The extension will test ASCII characters from 0~127.
6. When the test ends i.e. after testing all 127 chars, press enter to close the browser (there is [a bug](https://github.com/mozilla/web-ext/issues/1569) preventing Firefox from closing, you may have to close it manually.)
7. Input the name of the record and press enter. 
8. The result will be saved in `records.json`.
9. Clean up your download folder and repeat from step 4.
10. When all tests are done, run `npm run build-report` to analyze the result.
11. You have to choose a base record to compare with.
12. The result will be saved in `report.md`.

Result
-------

See [report.md](report.md).
