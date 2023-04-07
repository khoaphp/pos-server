const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const orderSchema = new mongoose.Schema({
    
    orderCode:String,
    orderType:Number, //   1 le, 2 si, 3 phone
    customerName:String, // ten nguoi order
    companyName:String, //  ten cong ty order

    categoryList:[
        {
            name:String,
            amount:Number,
            price:Number,
            tax:Number,
            discount:Number,
            _idCate:mongoose.SchemaTypes.ObjectId,
            lastPrice:Number,
            priceRoot:Number,
            taxCounting:Number,
            priceInOrder:Number,

            options:[{
                name:String,
                price:Number,
                fullPrice:Number,
                tax:String,
                _idOption:mongoose.SchemaTypes.ObjectId,
            }]
        }
    ],

    note:String,

    moneyAmount_customer:Number,
    moneyAmount_back:Number,

    totalOrderSubs:Number,
    totalOrders_Discount :Number,
    totalOrders_Final:Number,

    pickup_hour:Number,
    pickup_minute:Number,

    dateCreated:Date,
    status:Number  // 0 chua thanh toan, 1 thanh toan CASH, 2 thanh toan VISA
});
orderSchema.plugin(AutoIncrement, {inc_field:"orderingOrder"});
module.exports = mongoose.model("order", orderSchema);