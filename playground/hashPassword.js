const bcrypt = require('bcryptjs');

var password = 'vajid456';

// bcrypt.genSalt(10,(err, salt) => {
//     bcrypt.hash(password,salt,(err, hashPasswrod) => {
//         console.log('hashPasswrod is : ',hashPasswrod);
        
//     })
// })

var hashedPassword = '$2a$10$ref60cmUscU8QADs9pEzSu//4l9i4djOUoqREEKh/28yO1YZzrDcy';

bcrypt.compare(password,hashedPassword,(err ,res) => {
    console.log(res);
    
})