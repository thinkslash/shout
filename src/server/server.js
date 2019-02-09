const express = require('express');
const mongoose  = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport');

//Require users route.
const users = require('./routes/api/users');

//Get DB key.
const MONGO_URI = require('./config/keys').MONGO_URI; 

//Initialize express and mount middlewares.
const app = express();
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

mongoose
    .connect(MONGO_URI,{useNewUrlParser:true})
    .then(()=>console.log('MongoDB connected'))
    .catch(err=>console.log(err))

//Mount passport middleware
app.use(passport.initialize());

require('./config/passport')(passport);

//Each backend route will have an '/api' prefix.
app.use('/api/users',users);

const port = process.env.PORT || 7000;

app.listen(port,()=>{
    console.log('Server listening on ',port)
})

