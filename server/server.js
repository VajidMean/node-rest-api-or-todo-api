const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');


var {mongoose} = require('./db/mongoose');
var {Task} = require('./model/task-model');
var {User} = require('./model/user-mode'); 
var {authenticate} = require('./middleware/authenticate');

var app =express();
app.set('port',3000);
app.use(bodyParser.json());

app.post('/task',authenticate, (req,res)=> {
        // console.log(req.body);
        var task = new Task({
            name: req.body.name,
            status: req.body.status,
            assignedBy: req.body.assignedBy,
            assignedTo: req.body.assignedTo,
            _creator: req.user._id
            // password: req.body.password            
        })
        
        task.save().then(() => {
            // res.status(200).send(docs);
            return task.generateAuthToken();
            
        }).then((token) => {
            res.status(200).header('x-auth',token).send(task);
        }).catch((e) => {
            res.status(401).send(e);
        });

});

// Request with token ********************

app.get('/tasks/me',(req, res) => {
    var token = req.header('x-auth');

    Task.fincdByToken(token).then((task)=>{
        if(!task){
            res.status(401).send("task not found")
        }
        res.status(200).send(task);
    }).catch((e) => {
        res.status(401).send(e);
    })

});

//

app.get('/task',authenticate, (req, res) => {
    Task.find({
        _creator: req.user._id
    }).then((docs) => {
        res.send({docs})
    },(e) => {
        res.status(400).send(e);
    });
});

app.get('/task/:id',authenticate,(req, res) => {
    var id = req.params.id;
    // console.log(id);    
    if(!ObjectID.isValid(id)){
        return res.status(400).send("id is not formatted !");
    }
    Task.findOne({
        _id:id,
        _creator:req.user._id
    }).then((task123) => {
        if(!task123){
            return res.send("task not found");
        }
        res.send({task123});
    }).catch((e) => {
        res.send(JSON.stringify(e, undefined, 2));
    })
});

app.delete('/task/:id',authenticate, (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send("not a valid id");
    }

    Task.findOneAndRemove({
        _id:id,
        _creator:req.user._id
    }).then((task) => {
        if(!task){
            return res.send("task not found");
        }
        res.send(200).send({task})
    }).catch((e) => {
        res.send(e);    
    })
});

app.patch('/task/:id',authenticate , (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body,['name','status','assignedTo','assignedBy']);

    if(!ObjectID){
        return res.status(400).send("invalid id formate..!");
    }

    Task.findOneAndUpdate({_id:id , _creator: req.user._id},{$set : body},{new : true}).then((docs)=>{
        if(!docs){
            return res.send("task not found by this id..!");
        }
        res.status(200).send({docs});
    },(e)=>{
        res.status(400).send(e);
    });
});

//  USER DATA START :



app.post('/user',(req, res) => {
    var new_user = new User({
        email: req.body.email,
        password: req.body.password
    });
    new_user.save().then((user) => {
        // res.status(200).send(user);
        
        return new_user.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth',token).send(new_user);
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

app.get('/user',(req, res) => {
    User.find().then((users) => {
        res.send({users});
    },(e) => {
        res.status(400).send(e);
    });
});

app.get('/user/:id',(req, res) => {
    var id = req.params.id;
        if(!ObjectID.isValid(id)){
            return res.status(400).send("id is not formatted");            
        }
        User.findById(id).then((user)=>{
            if(!user){
                return res.status(400).send("user not found !");
            }
            res.send({user});
        }).catch((e)=>{
            res.status(400).send(e);
        })
});

app.delete('/user/:id',(req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send("not a valid ID !");
    }

    User.findByIdAndRemove(id).then((user) => {
        if(!user){
            res.send("user not found");
        }
        res.status(200).send("USER DELETED : ",{user})
    }).catch((e) => {
        res.status(404).send(e);
    })
});


app.patch('/user/:id',(req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body,['email','name']);

    if(!ObjectID.isValid(id)){
        return res.status(400).send("invalid id formate..!");
    }
    
    User.findByIdAndUpdate(id, {$set : body},{new : true}).then((docs)=>{
        if(!docs){
            return res.send("user not found by this id..!")
        }
        res.send({docs});
    },(e)=>{
        res.status(400).send(e);
    })
});



app.get('/users/demo',authenticate,(req, res) => {
    res.send(req.user)
});
// Delete token at logout ******************************************

// app.delete('/users/demo/token',authenticate,(req, res) => {
//     // var token = req.token;
//     // res.send(token);

//     req.user.removeToken(req.token).then(()=>{                 
//         res.status(200).send();

//     }).catch(()=>{
//         res.status(404).send();

//     });
    
// });

app.delete('/users/demo/token',authenticate,(req, res) => {
    
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send("token removed !");
    }).catch((e)=>{
        res.status(404).send(e);
    });
});

// app.post('/users/login',(req, res) => {
//     var body = _.pick(req.body,['email','password']);

//     User.findByCredential(body.email, body.password).then((user) => { 
//         res.send(user);
//     }).catch((e) => {
//         res.status(400).send(e);
//     });
// });


app.post('/users/login',(req, res) => {
    
    var body = _.pick(req.body,['email','password']);
    
    User.findByCredential(body.email,body.password).then((user) => {
        res.send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});



    var server = app.listen(app.get('port'),()=>{
        var port = server.address().port;
        console.log("currently server is running onn port no: ",port);
        
    })

module.exports = { app }