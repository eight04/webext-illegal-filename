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

export default cases;
