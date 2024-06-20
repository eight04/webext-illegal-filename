/* global IP */
import browser from "webextension-polyfill";

init();

async function init() {
  await browserAction();
  const downloadState = createDownloadState();

  const cases = [];

  for (let i = 0; i < 128; i++) {
    cases.push({
      name: `char-${i}`,
      filename: `test-${i}-${String.fromCharCode(i)}.html`
    });
  }

  cases.push(...[
    {
      name: "dot-space",
      filename: "1. This is foo.html"
    },
    {
      name: "dot-space-2",
      filename: "1.This is foo.html"
    },
    {
      name: "dot-space-3",
      filename: "1.1 This is foo.html"
    },
    {
      name: "dot-space-folder",
      filename: "1. This is foo/bar.html"
    },
    {
      name: "dot-space-2-folder",
      filename: "1.This is foo/bar.html"
    },
    {
      name: "dot-space-3-folder",
      filename: "1.1 This is foo/bar.html"
    },
  ]);

  for (const c of cases) {
    console.log(c.name);
    let id;
    try {
      id = await browser.downloads.download({
        url: `https://example.com/`,
        filename: c.filename
      });
    } catch (err) {
      await fetch(`http://${IP}:8080/report`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({case: c.name, status: "failed", err: String(err)})
      });
      continue;
    }
    console.log(`download id: ${id}`)
    let downloadItem;
    try {
      downloadItem = await downloadState.complete(id);
    } catch (err) {
      await fetch(`http://${IP}:8080/report`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({case: c.name, status: "failed", err: String(err)})
      });
      continue;
    }
    console.log(downloadItem);
    await fetch(`http://${IP}:8080/report`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({case: c.name, status: "succeeded", filename: downloadItem.filename})
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

function createDownloadState() {
  const cache = new Map();
  browser.downloads.onCreated.addListener(item => {
    if (!cache.has(item.id)) {
      cache.set(item.id, {created: null, changes: [], erased: false});
    }
    const c = cache.get(item.id);
    c.created = item;
  });
  browser.downloads.onChanged.addListener(delta => {
    const item = cache.get(delta.id);
    item.changes.push(delta);
    item.onchange?.(delta);
  });
  browser.downloads.onErased.addListener(id => {
    const item = cache.get(id);
    item.erased = true;
  });

  return {
    complete
  };

  async function getFile(id) {
    const files = await browser.downloads.search({id});
    if (files.length === 0) {
      throw new Error('file not found');
    }
    return files[0];
  }

  function complete(id) {
    return new Promise((resolve, reject) => {
      let item = cache.get(id);
      if (!item) {
        item = {created: null, changes: [], erased: false};
        cache.set(id, item);
      }
      if (item.changes.some(delta => delta.state?.current === 'complete')) {
        getFile(id).then(resolve);
        return;
      }
      if (item.erased) {
        reject(new Error('download is erased'));
        return;
      }
      if (item.changes.some(delta => delta.error?.current)) {
        reject(new Error(`download failed: ${item.changes.find(delta => delta.error?.current).error.current}`));
        return;
      }
      item.onchange = delta => {
        if (delta.state?.current === 'complete') {
          getFile(id).then(resolve);
          return;
        }
        if (delta.error?.current) {
          reject(new Error(`download failed: ${delta.error.current}`));
          return;
        }
      }
    });
  }
}
