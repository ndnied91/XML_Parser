const express = require("express"); // express is for routing
const app = express(); //creates the "app" that routes

const bodyParser = require('body-parser');


const PORT = process.env.port || 3000

let list = ['apple', 'banana', 'orange']


app.get('/', (req,res)=>{
  res.send(list)
})






app.listen(PORT, ()=> console.log( `server running ${PORT}`))
