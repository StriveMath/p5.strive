// output functions are configurable.  This one just appends some text
// to a pre element.
function outf(text) {
  console.log(text);
}

function builtinRead(x) {
  if (
    Sk.builtinFiles === undefined ||
    Sk.builtinFiles["files"][x] === undefined
  )
    throw "File not found: '" + x + "'";
  return Sk.builtinFiles["files"][x];
}

function uncaught(pythonException) {
  const lineno = pythonException.traceback[0].lineno;
  const msg = pythonException.args.v[0].v;
  const errorMessage = msg + " on line " + lineno;
  console.error(errorMessage);
  throw new Error("");
}

function runCode() {
  $("#sketch-holder").text("");
  $.get(
    "sketch.py",
    function (prog) {
      Sk.pre = "output";
      Sk.configure({
        output: outf,
        read: builtinRead,
        uncaughtException: uncaught,
      });
      Sk.canvas = "sketch-holder";
      const myPromise = Sk.misceval.asyncToPromise(function () {
        return Sk.importMainWithBody(
          "<stdin>",
          false,
          prog.trim() + "\nrun()",
          true
        );
      });
      myPromise.then(
        function (mod) {
          console.log(" ");
        },
        function (err) {
          console.log(err.toString());
        }
      );
    },
    "text"
  );
}

runCode();
