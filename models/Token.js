const mongoose = require("mongoose");
const tokenSchema = new mongoose.Schema({
    idUser:mongoose.SchemaTypes.ObjectId,
    token:String,
    dateCreated:Date,
    status:Boolean
});
module.exports = mongoose.model("token", tokenSchema);