const jwt = require('jsonwebtoken');

var data = {
    id: 1,
    name: 'JWT',
}

var token = jwt.sign(data,'demo123').toString();//demo123 is secret key which is include at last.
console.log(`token${token}`);

var decode_token = jwt.verify(token,'demo123');
console.log(`decoded token is ${JSON.stringify(decode_token)}`);

