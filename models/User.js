const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    phoneNo:String,

    userType:Number,       // 0 normal, 1 administrators
    active:Boolean
});
module.exports = mongoose.model("user", userSchema);