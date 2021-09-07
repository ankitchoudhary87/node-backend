const express = require('express')
const cors = require('cors')
const fileupload = require('express-fileupload')
const connectDB = require('./utils/dbConnection')

const app = express();
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
app.use(fileupload())
//app.use(express.static(__dirname + '/public'));
// Routes
const user = require('./routes/user')
app.use('/user',user);
const category = require('./routes/category');
app.use('/category',category);
const product = require('./routes/product')
app.use('/product',product);
//Routes
app.listen(9001, () => {
    console.log("server is running on port 9001");
})