const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const optionSchema = new mongoose.Schema({
    _idSubCate:mongoose.SchemaTypes.ObjectId,
    name:String,
    active:Boolean,
    price_single:Number,
    price_multiple:Number,
    tax:Number
});
optionSchema.plugin(AutoIncrement, {inc_field:"ordering3"});
module.exports = mongoose.model("option", optionSchema);