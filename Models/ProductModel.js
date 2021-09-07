const mongoose = require('mongoose')

// Create Schema
const ProductSchema = new mongoose.Schema({
    name:{type: String, required: true, trim: true},
    slug:{type: String, required: true, trim: true, unique: true},
    quantity:{type: Number, required:true},
    price:{type: Number, required: true, trim: true},
    category:{type: mongoose.Schema.Types.ObjectId, ref: 'categories', required: true, trim: true},
    discount:{type: Number, trim: true},
    description:{type: String, required: true, trim: true},
    productPictures:[
        { img: {type: String, trim: true} }
    ],
    status:{type: Boolean, required: true, default: true},
    updatedAt: Date
},{ timestamps: true })

module.exports = new mongoose.model("products", ProductSchema);