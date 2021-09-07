const mongoose = require('mongoose')
const conn = mongoose.connect("mongodb://localhost:27017/LoginRegisterDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, ()=>{
    console.log("DB connected successfully");
})
module.exports = conn;
