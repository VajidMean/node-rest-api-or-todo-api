const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
// const bcrypt = require('bcryptjs');

var taskSchemas = mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength:'5',
        trim: true
    },
    status: {
        type: String      
    },  
    assignedBy: {
        type: String
    },
    assignedTo: {
        type: String
    },
    // password:{
    //     type:String,
    //     required:true
    // },
    tokens:[{
        token:{
            type:String,
            required:true
        },
        access:{
            type:String,
            required:true
        }
    }],
    _creator:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
});

taskSchemas.methods.generateAuthToken = function(){
    var task = this;
    var access = 'auth';
    var token = jwt.sign({ _id:task._id.toHexString(),access},'scretKey123').toString();

    task.tokens.push({token,access});
    return task.save().then(() => {
        return token;
    });
}

taskSchemas.methods.toJSON = function(){
    var task = this;
    var taskObj = task.toObject();
    return _.pick(taskObj,['_id','name','status','assignedBy','assignedTo','_creator']);
}

taskSchemas.statics.fincdByToken = function(token){
    var task = this;
    var decoded;

    try {
        decoded = jwt.verify(token,'scretKey123');
    } catch (error) {
        return Promise.reject();
    }
    
    return Task.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
    
};

// taskSchemas.pre('save',function(next){
//     var task = this;
//     if(task.isModified('password')){
//         bcrypt.genSalt(10,(err, salt) => {
//             bcrypt.hash(task.password, salt, (err, hash) => {
//                 task.password = hash;
//                 next();
//             })
//         })
//     }else{
//         next();
//     }
// });

var Task = mongoose.model('Task',taskSchemas);

module.exports = { Task }