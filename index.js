const express = require('express');
const MongoClient = require('mongodb').MongoClient
const app = express();
const bParser = require('body-parser')


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static('TrashonBaynes_devAssignment3'))

app.use(bParser.urlencoded({ extended: true}));
app.use('/styles', (req, res) =>{
    res.type('.css')
    res.sendFile(__dirname + '/styles.css')
})
app.use('/logo', (req,res) => {
    res.sendFile(__dirname + '/logo.png')
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html')
})
app.get('/home', (req, res) => {   
    res.sendFile(__dirname + '/home.html')
})
app.get('/newUser', (req,res) => {
    res.sendFile(__dirname + '/newUser.html')
})//end get
app.get('/newTask', (req,res) =>{
       res.sendFile(__dirname + '/newTask.html')
})//end get
app.get('/Default', (req, res) =>{
    MongoClient.connect('mongodb://localhost:27017/Users', (err, db) => {
        var space = '&nbsp'
        if (err) throw err
        var dbCollection = db.collection('Tasks');
                dbCollection.find().toArray( (err, documents) => {
                var arrayLength = documents.length;
                var html = ""
                if(arrayLength === null || arrayLength === undefined || !arrayLength){
                    res.sendFile(__dirname +'/newTask.html')
                }
                else{
                for (var i = 0; i < arrayLength; i++) {
                 html = html + '<li>' + documents[i].task + '</li>' ;
                }
                html = '<link rel="stylesheet" href="styles"></link>' + '<div><img src = "logo"></img></div>' + 
                '<a href="http://localhost:4000/newTask">Click to create new task</a>' +
                space + space + '<a href="http://localhost:4000/newUser">Click to create a new login</a>'  + html 
                console.log(documents[0].task)
                res.send(html)};
                 db.close();
                }); //end find
        }); //end .connect
})
app.post('/Default', (req, res) => {    // checks post data from app.get('/') & links to login if unsuccesful or to show tasks page if successful
    var user = req.body.userName;
    var pass = req.body.password;
    MongoClient.connect('mongodb://localhost:27017/Users', (err, db) => {
	if (err) throw err
	var dbCollection = db.collection('login');
        dbCollection.findOne({'userName': user}, (err, document) => {
            if(document === null || !document || document === undefined || err)
            {
                html = '<div>unsuccessfull login'+
                '<a href="http://localhost:4000/home">Click to go to login</a>'
                console.log(document)
                res.send(html);
            }
            else if(document.password === pass && document.password !== null){
                console.log(document.userName);
               res.redirect('http://localhost:4000/Default')
            }
            else
            {
                html = '<div>unsuccessfull login'+
                '<a href="http://localhost:4000/home">Click to go to login</a>'
                res.send(html);
                console.log(document.userName);
            }
         db.close();
        }); //end findOne
	}); //end .connect
})// end .post
app.post('/home', (req,res) => {
    var userName = req.body.userName
    var password= req.body.password
    var email= req.body.email
    var firstName = req.body.firstName
    var lastName = req.body.lastName
    MongoClient.connect('mongodb://localhost:27017/Users', (err, db) => {
        if(err) throw err
        var dbCollection = db.collection('login')
        dbCollection.insert({"userName":userName, "password":password, "email":email, "firstName":firstName, "lastName":lastName }, (err, result) => {
            dbCollection.find().toArray((err, documents) => {
                console.log();
                 res.redirect('http://localhost:4000/home');
                 db.close();
                }); //end find
        }) //end insert
    }) //end connect
})
app.post('/newTask', (req, res) => {   
    var task = req.body.task
    MongoClient.connect('mongodb://localhost:27017/Users', (err, db) => {
        if(err) throw err
        var dbCollection = db.collection('Tasks')
        dbCollection.insert({"task":task}, (err, result) => {
            dbCollection.find().toArray( (err, documents) => {
                console.log(documents[0].task);
                 res.redirect('http://localhost:4000/newTask');
                 db.close();
                }); //end find
        }) //end insert
    }) //end connect
})//end post
app.listen(4000,  ()=>  {
    console.log("app listening on port 4000");
  });
  