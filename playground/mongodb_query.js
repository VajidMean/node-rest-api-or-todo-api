const object_id = require('mongodb')

const { Task } = require('../server/model/task-model');
const { User } = require('../server/model/user-mode');
const { mongoose } =  require('../server/db/mongoose');

var id = '5ad821333b40da02584ce63b';
Task.findById('5ad821333b40da02584ce63b').then((task) => {
    if(!task){
        return console.log('unable to find user');        
    }
    // console.log(task);
    console.log(JSON.stringify(task, undefined, 2));    
},(e) => {
    console.log("error in fincind data");    
});

User.findById(id).then((user) => {
    if(!user){
        return console.log("user not found");        
    }
    console.log(JSON.stringify(user, undefined, 2));        
},(e) => {
    console.log("id is not valie or somthing error occu",e);    
});

