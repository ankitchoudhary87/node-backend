const mongoose = require('mongoose')

// Create Schema
// datecreated:{type: Date, default: Date.now}
const UserSchema = new mongoose.Schema({
    first_name:{type: String, required: true, trim: true},
    last_name:{type: String, required: true, trim: true},
    email:{type: String, required: true, unique: true, trim: true, match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter a valid Email'
    ]},
    phone:{type: String, trim: true},
    password:{type: String, required: true},
    user_type:{type: String, required: true, enum: ['Super Admin', 'Admin', 'Staff', 'Account']},
    status:{type: Boolean, default: true}
},{ timestamps: true });

module.exports = new mongoose.model("users", UserSchema);