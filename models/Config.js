const mongoose = require("mongoose");
const configSchema = new mongoose.Schema({
    logo:String,
    line1:String,
    line2:String,
    line3:String,
    abn:String,
    note:String,
    numberPrint:Number
});
module.exports = mongoose.model("config", configSchema);