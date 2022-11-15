//imports
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const routes = require('./routes/routes')

const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('uploads'))

//database connection
mongoose.connect(process.env.DB_URI_LIVE,{
    useNewUrlParser : true,
    useUnifiedTopology: true
    //useFindAndModify: true,
    //useCreateIndex: true
}).then(() => console.log("Connected to the database"))
.catch(err=>console.log(err));


//router connect
app.use('/api/user',routes)


//start the server
app.listen(port,()=>{
    console.log(`server running at http://localhost:${port}`);
})
