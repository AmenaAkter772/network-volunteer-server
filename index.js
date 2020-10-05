const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID
require('dotenv').config()
const cors = require('cors')
const app = express()
const port =5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e2egq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


app.get('/', (req, res) => {
  res.send('Hello World!')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("volunteerNetwork").collection("volunteer");
  const registerCollection = client.db("volunteerNetwork").collection("register");
  
  app.post('/addVolunteer', (req, res) => {
     const volunteer = req.body;
     collection.insertOne(volunteer)
     .then(result => {
         res.send(result.insertedCount > 0)
     })
  })

  app.get('/volunteer', (req, res) => {
      collection.find({})
      .toArray( (err, documents) => {
          res.send(documents);
      })
  })

  app.post('/addRegister', (req, res) => {
    const register = req.body;
    console.log(register)
    registerCollection.insertOne(register)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
 })

 app.get('/registerItem', (req, res) => {
  registerCollection.find({email: req.query.email})
  .toArray( (err, documents) => {
      res.send(documents);
  })
})

app.delete('/delete/:id',(req,res)=>{
  registerCollection.deleteOne({_id:ObjectID(req.params.id)})
  .then(result=>{
    res.send(result.deletedCount > 0)
  })
})

});


app.listen(port)