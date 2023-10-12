const express = require('express')
const app = express()
const urlprefix ='/api'
const mongoose = require('mongoose')
const Fruit = require('./models/fruit')
const fs = require('fs');
const cert = fs.readFileSync('keys/certificate.pem');
const options = {
    server: {sslCA: cert}};
const connstring ='mongodb+srv://osmanfawwaz:7241BLkynOcg0uFT@cluster1.vqwcyoy.mongodb.net/?retryWrites=true&w=majority'    

const fruitRoutes = require("./routes/fruit");
const userRoutes = require("./routes/user");

mongoose.connect(connstring)
.then(()=>
{
    console.log('Connected :)')
})
.catch(()=> 
{
    console.log('NOT Connected :(')
},options);

app.use(express.json())

app.use((reg,res,next)=>
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
});

app.get(urlprefix+'/', (req, res) => {
    res.send('Hello World')
})


app.use(urlprefix+'/fruits', fruitRoutes)
app.use(urlprefix+'/user', userRoutes)

module.exports = app;