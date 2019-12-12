const jsforce = require('jsforce');
const conn = new jsforce.Connection({});
conn.login('###########', '###########', function(err, userInfo) {
  if (err) { return console.error(err); }
  conn.streaming.topic("/event/ChangeEvents__e").subscribe(function(message) {
    console.dir(message);
  });
});