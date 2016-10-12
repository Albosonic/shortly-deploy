var app = require('./server-config.js');

var port = process.env.port || 4568;

app.listen(port);

console.log('Server now listening on port ' + port);

// #!/bin/sh
// git --work-tree=/root/shortly-deploy --git-dir=/root/bear checkout -f
//   eeda1cf069d09cc7