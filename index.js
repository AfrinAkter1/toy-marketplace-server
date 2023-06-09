const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.SECRET_USER}:${process.env.SECRET_PASS}@cluster0.wcry9bp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    const toyCollection = client.db('toyDB').collection('cars')
    
    // post in add a toy server page
    app.post('/allcars',async (req, res) => {
       const cars = req.body;
       console.log(cars)
       const result = await toyCollection.insertOne(cars)
       res.send(result)
    })
     




    // get data
    app.get('/allcars',async (req, res) =>{
      let query = {}
      if(req.query?.carType){
        query ={carType: req.query.carType}
      }
      const result = await toyCollection.find(query).toArray()
      res.send(result)
    })

    


    // specific data find use id
    app.get("/alltoys/:id" , async(req , res)=>{
      const id =req.params.id 
      const query = { _id :new ObjectId(id)};
      const result = await toyCollection.findOne(query);
      res.send(result)
    })






 // descending
    app.get('/allmytoy/:email/lowPrice', async(req, res) =>{
      const email = req.params.email;
      const query = {sellerEmail :  email}
      const result = await toyCollection.find(query).sort({price: -1}).toArray()
      res.send(result)
     })





 // esacending
    app.get('/allmytoy/:email/highPrice', async(req, res) =>{
      const email = req.params.email;
      const query = {sellerEmail :  email}
      const result = await toyCollection.find(query).sort({price: 1}).toArray()
      res.send(result)
     })







// update data
    app.put('/alltoys/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updateToy = req.body;
      const toyDoc = {
        $set: {
          price: updateToy.price,
          quantity: updateToy.quantity,
          details: updateToy.details
        }
      }
      const result = await toyCollection.updateOne(filter, toyDoc, options)
      res.send(result)
    })




    // all car page in search data
   app.get('/allcars/searchAll/:text', async(req, res) =>{
    const searchText = req.params.text;
    const result = await toyCollection.find({
      $or: [
        {toyName: {$regex: searchText, $options: "i"}}
      ]
    }).toArray()
    res.send(result)
   })
   

 
 // specific data find use email
    app.get('/allcars/:sellerEmail',async (req, res) =>{
      const email = req.params.sellerEmail;
      const query = {sellerEmail : email}
      const result = await toyCollection.find(query).toArray()
      res.send(result)
    })



    // delete data
   app.delete('/allcars/:id', async(req, res) =>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)  };
    const result = await toyCollection.deleteOne(query);
    res.send(result)
   })
 


  
  


    // Send a ping to confirm a successful connection
     client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) =>{
    res.send('Toy server is running')
})
app.listen(port, () =>{
    console.log(`server is running on port ${port}`)
})