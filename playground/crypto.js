const jwt = require('jsonwebtoken');

var data = {
    id: 4,
    data:'demo_data'
}

var token = jwt.sign(data,'abcdabcd');
console.log('token',token);

var decode = jwt.verify(token,'abcdabcd');
console.log('decoded : ',decode);

                //practice
                    // var user = {
                    //     name: 'vajid',
                    //     surname: 'khokhar'
                    // }

                    // var token_2 = jwt.sign(data,'demo123');
                    // var decode_data = jwt.verify(token_2,'demo123');
                    // console.log('token_2',token_2,'decoded',decode_data);




    // const {SHA256} = require('crypto-js');

    // var message = 'my name is vajif khokhar.';
    // var cryp_message = SHA256(message).toString();

    // console.log(message);
    // console.log(cryp_message);