const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var userSchemas = mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 5,    
        unique:true    
    },
    password:{
        type:String,
        required:true,
        minlength:5
    },
    tokens:[{
        token:{
            type:String,
            required:true
        },
        access:{
            type:String,
            required:true
        }
    }]
});

userSchemas.methods.generateAuthToken = function(){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(),access},'secretKey123').toString();

    user.tokens.push({token, access});
    return user.save().then(()=>{
        return token;
    });
};

userSchemas.methods.toJSON = function(){
    var user = this;
    var userObj = user.toObject();
    return _.pick(userObj,['_id','email']);
}

// userSchemas.methods.removeToken = function(token){
//     var user = this;
    
//     return user.update({
//         $pull:{
//             tokens:{
//                 token: token
//             }
//         }
//     });
// };

userSchemas.methods.removeToken = function(token){

    var user = this;
    return user.update({
        $pull:{
            tokens:{
                token:token
            }
        }
    });
};


userSchemas.statics.findByToken = function(token){
    var user = this;
    var decode;

    try {
        decode = jwt.verify(token,'secretKey123');
    } catch (error) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decode._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });

};


userSchemas.pre('save', function(next){
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err, salt) => {
            // console.log(user.password);
            
            bcrypt.hash(user.password, salt, (err, hash) => {
                // console.log('hash_password is : ',hash);
                
                user.password = hash;
                next();
            });
        })
    }else{
        next();
    }
});



// userSchemas.statics.findByCredential = function(email, password){
//     var user123 = this;

//     return user123.findOne({email}).then((user) => {
//         if(!user){
//             return Promise.reject("no user found");
//         }
//        return new Promise((resolve, reject) => {
//             bcrypt.compare(password,user.password,(err, res) => {
//                 if(res){
//                     resolve(user);
//                 }else{
//                     reject("password not same");
//                 }
//             })
//         });
//     })
// }

userSchemas.statics.findByCredential = function(email, password){
    var user1 = this;

    return user1.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject("user not found by given email address");
        }

            return new Promise((resolve, reject) => {
                    bcrypt.compare(password,user.password,(err, res) => {
                        if(res){
                            resolve(user);
                        }else{
                            reject("wrong password !");
                        }
                    });
            });
    })
}


var User = mongoose.model('User',userSchemas);

module.exports = { User }



