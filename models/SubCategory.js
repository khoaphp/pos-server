const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const subcategorySchema = new mongoose.Schema({
    _idCategory:mongoose.SchemaTypes.ObjectId,
    name:String,
    ordering2:Number,
    active:Boolean,
    price_single:Number,
    price_multiple:Number,
    tax:Number
});
subcategorySchema.plugin(AutoIncrement, {inc_field:"ordering2"});
module.exports = mongoose.model("subcategory", subcategorySchema);