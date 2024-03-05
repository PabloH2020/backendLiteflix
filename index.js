const express = require('express')
require('dotenv').config()
const cors = require('cors')
const bodyParser = require('body-parser')
const uuid = require('uuid')
const mongoose = require('mongoose')
const multer = require('multer')
const fs = require('fs')
require("dotenv").config()


const app = express()
app.use(bodyParser.json())
app.use(cors())
// app.use("/movieUpload",express.static('uploads'))
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
})


// "mongodb://localhost:27017/movieUpload"
mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
  console.log('mongo db connected');
})
.catch(()=>{
  console.log('mongodb connection issue')
  console.log('error')
})

const peliculaSchema = new mongoose.Schema({
    id:{
      type:String,
      required:true
    },
    imagen:{
        type:String,
        required:true
    },
    titulo:{
        type:String,
        required:true
    }
  })

 const PeliculaCollection = mongoose.model('peliculas', peliculaSchema)



//  upload.single('imagen'),async

app.post('/movieUpload', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
   

  console.log('body',req.body)
  const newMovieData = {
      id:uuid.v1(),
      imagen:req.body[0].imagen,
      titulo:req.body[0].titulo
  }
  
   
  try {
    PeliculaCollection.insertMany([newMovieData])
    res.status(200).json({message:'Movie Saved in database'})

  } catch (error) {

    res.status(500).json({message:error.message})
  }
})

app.get('/getMyMovies', async (req, res) => {
  
  res.header("Access-Control-Allow-Origin", "*");
  try {
     const myMovies = await PeliculaCollection.find()
    
    console.log(myMovies)
    // res.status(200).send(myMovies)
    
    res.status(200).json({message:'My movies retrieved',movies:myMovies})

  } catch (error) {

    res.status(500).json({message:error.message})
  }
})

const port = process.env.PORT || 27017
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
