/* global IP */
import browser from "webextension-polyfill";

init();

async function init() {
  await browserAction();

  for (let i = 0; i < 128; i++) {
    console.log(i);
    const char = String.fromCharCode(i);
    let id;
    try {
      id = await browser.downloads.download({
        url: `https://example.com/`,
        filename: `test-${i}-${char}.html`
      });
    } catch (err) {
      await fetch(`http://${IP}:8080/report`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({case: i, status: "failed", err: String(err)})
      });
      continue;
    }
    console.log(`download id: ${id}`)
    let downloadItem;
    try {
      downloadItem = await downloadComplete(id);
    } catch (err) {
      await fetch(`http://${IP}:8080/report`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({case: i, status: "failed", err: String(err)})
      });
      continue;
    }
    console.log(downloadItem);
    await fetch(`http://${IP}:8080/report`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({case: i, status: "succeeded", filename: downloadItem.filename})
    });
  }
}

function browserAction() {
  // return new Promise(resolve => {
    // browser.browserAction.onClicked.addListener(function listener() {
      // resolve();
      // browser.browserAction.onClicked.removeListener(listener);
    // });
  // });
  return Promise.resolve();
}

function downloadComplete(id) {
  return new Promise((resolve, reject) => {
    let _;
    browser.downloads.onChanged.addListener(_ = delta => {
      if (delta.id !== id) return;
      
      if (delta.error?.current) {
        reject(new Error(`download failed: ${delta.error?.current}`));
        browser.downloads.onChanged.removeListener(_);
        return;
      }
      
      switch (delta.state?.current) {
        case 'interrupted':
          reject(new Error('download is interrupted'));
          browser.downloads.onChanged.removeListener(_);
          return;
        case 'complete':
          browser.downloads.search({id}).then(items => {
            resolve(items[0]);
          });
          browser.downloads.onChanged.removeListener(_);
          return;
      }
    });
  });
}
