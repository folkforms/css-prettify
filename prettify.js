const fs = require('fs-extra');
const io = require('@folkforms/file-io');
const glob = require('glob');
const css = require('css');

const parseArgs = () => {
  const flags = {
    glob: process.argv[2],
    prettify: false,
    dryRun: false,
    check: false,
    ignoreErrors: false,
    minify: false,
  };
  for(let i = 3; i < process.argv.length; i++) {
    if(process.argv[i] === "-n" || process.argv[i] === "--dry-run") {
      flags.dryRun = true;
    }
    if(process.argv[i] === "-p" || process.argv[i] === "--prettify") {
      flags.prettify = true;
    }
    if(process.argv[i] === "-c" || process.argv[i] === "--check") {
      flags.check = true;
    }
    if(process.argv[i] === "-i" || process.argv[i] === "--ignore-errors") {
      flags.ignoreErrors = true;
    }
    if(process.argv[i] === "-m" || process.argv[i] === "--minify") {
      flags.minify = true;
    }
  }
  // Validate the chosen options
  if((!flags.prettify && !flags.check) || (flags.prettify && flags.check)) {
    throw new Error(`ERROR: Must specify exactly one of -p/--prettify or -c/--check.`);
  }
  return flags;
}

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

// ----------------------------------------------------------------

// Parse args: glob [-p/--prettify] [-c/--check] [-i/--ignore-errors] [-m/--minify]
// glob: Prettify the globbed files.
// --prettify: Prettify the given files. [Default if no other option specified?]
// --check: Throws errors if files not already prettified.
// --ignore-errors: Ignores errors. Cannot be used with --check. [Not sure of the use-case for this.]
// --minify: Minifies the CSS files. Writes the names as X.min.css.

const flags = parseArgs();
const inputFiles = glob.sync(flags.glob);
inputFiles.forEach(file => {
  if (flags.prettify) {

    let contents = io.readLines(file);
    contents = prettify(contents, file);
    const outputFile = io.writeLines(file + ".test.css", contents);

  } else if (flags.check) {

    const before = io.readLines(file);
    const after = prettify(before, file);
    if (before !== after) {
      throw new Error(`css-prettify: Check failed because file '${file}' was not already prettified.`);
    }
  }
});

return 0;
