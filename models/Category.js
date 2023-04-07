const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const categorySchema = new mongoose.Schema({
    name:String,
    ordering:Number,
    active:Boolean
});
categorySchema.plugin(AutoIncrement, {inc_field:"ordering"});
module.exports = mongoose.model("category", categorySchema);