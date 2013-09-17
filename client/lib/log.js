
log = function(msg,arg) {
  if (arg === undefined) {
    console.log(EJSON.stringify(msg));
  } else {
    console.log(msg + " = " + EJSON.stringify(arg));
  }
};
