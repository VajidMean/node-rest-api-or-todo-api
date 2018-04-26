const {User} = require('../model/user-mode');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');
    

    User.findByToken(token).then((user)=>{
        if(!user){
            // return res.send("no user found !");
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send(e);
    });

};

module.exports = { authenticate }