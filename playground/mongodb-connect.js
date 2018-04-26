const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/Users',(err, db) => {
    if(err){
        return console.log("Eroor : ",err);
        
    }
    console.log("successfully connected with database");
//insertOne in database    
                db.collection('user').insertOne({
                    name: 'vajid',
                    surname: 'khokhar',
                    type: 'trainee'
                },(err, result) => {
                    if(err){
                       return console.log("Error  : ",err);
                    }
                    console.log(JSON.stringify(result, undefined,2));        
                })
//find from database    
                db.collection('user').find({type : 'employee'}).toArray().then((docs) => {
                    console.log("document from database ius listed below");        
                    console.log(JSON.stringify(docs, undefined, 2));
                    
                },(err) => {
                    console.log("Error in fatching docs : ",err);
                    
                });
//DeleteOne
                db.collection('user').deleteOne({surname: 'khokhar'}).then((result) => {
                    console.log("record deleted",result);
                    
                })
//delete many
                db.collection('user').deleteMany({surname: 'khokhar'}).then((result) => {
                    console.log("Deleted ",result);
                    
                })
//find one and delete one
                db.collection('user').findOneAndDelete({name: 'heena'}).then((result) => {
                    console.log("successfully deleted ",result);
                    
                })
db.close();

})