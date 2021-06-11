const css = require('css');

const cssPrettify = (contents, filename) => {
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

module.exports = cssPrettify;
