const mongoose = require('mongoose');
// Create Schema
//datecreated :{type: Date, default: Date.now},
//createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "users", required: true}
const CategorySchema = new mongoose.Schema({
    name : {type: String, required: true, trim: true},
    slug : {type: String, required: true, unique: true, trim: true},
    parentID : {type: String, trim: true},
    status : {type: Boolean, default: true},
    image : {type: String, trim: true}
},{ timestamps: true });
// Create model
module.exports = new mongoose.model("categories", CategorySchema)
