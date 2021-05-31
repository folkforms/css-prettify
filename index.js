const fs = require('fs-extra');
const io = require('@folkforms/file-io');
const css = require('css');

const prettify = (contents, filename) => {
  try {
    const options = { silent: false, source: filename };
    const ast = css.parse(contents, options);
    return css.stringify(ast);
  } catch(err) {
    console.log(`ERROR: Failed to parse file ${err.filename} line ${err.line} column ${err.column}`);
    console.log(`Reason: ${err.reason}`);
    const split = contents.split('\n');
    console.log(`Hint: This line may contain invalid CSS: ${split[err.line - 1]}`);
    return 1;
  }
}

// FIXME Parse args: glob [--check] [--ignore-errors] [--minify]

// glob: Prettify the globbed files.
// --check: Throws errors if files not already prettified or invalid css.
// --ignore-errors: Ignores errors. Cannot be used with --check. [Not sure of the use-case for this.]
// --minify: Minifies the CSS files. Writes the names as X.min.css.

console.log(`process.argv = ${process.argv}`);

/*
const option = process.argv[2];
let dryRun = false;
for(let i = 0; i < process.argv.length; i++) {
  if(process.argv[i] === "-n" || process.argv[i] === "--dry-run") {
    dryRun = true;
    process.argv.splice(i, 1);
    break;
  }
}
*/

const filename = process.argv[2];

let contents = io.readLines(filename);
contents = prettify(contents, filename);
const outputFile = io.writeLines(filename + ".test.css", contents);
return 0;
