const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/Users',(err, db)=> {
    if(err){
    return console.log("Error",err);
        
    }
    // console.log('successfully connected ',db);
    db.collection('user').findOneAndUpdate({
        name: 'chiku'
    },{
        $inc:{
            age : 1.0
        }
    },{
        returnOriginal: false 
    }).then((result) => {
        console.log('successfully updated record',result);
        
    })
    db.close();
})