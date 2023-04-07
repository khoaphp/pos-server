var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const axios = require('axios');

var User = require("../models/User");
var Token = require("../models/Token");
var Category = require("../models/Category");
var SubCategory = require("../models/SubCategory");
var Option = require("../models/Option");
var Order = require("../models/Order");
var Config = require("../models/Config");

// var newConfig = new Config({
//     logo:"./logo.jpg",
//     line1:"Diamon Plaza",
//     line2:"167 Nam Ky Khoi Nghia",
//     line3:"District 1, 70000",
//     abn:"ABN 85 031 112 968",
//     numberPrint:1 
// });
// newConfig.save(function(e){});

// bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash("123456", salt, function(err, hash) {
//         var admin = new User({
//             username:"admin",
//             password:hash,
//             phoneNo:"0966908907",
        
//             userType:1,       // 0 normal, 1 administrators
//             active:true
//         });
//         admin.save().then((e, result)=>{
//             if(!e){ console.log("Save new administrator sucessfully."); }
//         }).catch((e2)=>{console.log(e2);});
//     });
// });

// upload file with Multer
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + "-" + file.originalname)
    }
});  
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png"  || file.mimetype=="image/jpg"  || file.mimetype=="image/jpeg"){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("avatar");


module.exports = function(app, obj, randomString, secretTokenNo) {

    // middleware

    function checkAdministrator(req, res, next){
        if(req.cookies.TOKEN==undefined){
            res.redirect(obj.domain);
        }else{
            axios.post(obj.domain + '/verifyAdministrator', {
                token:req.cookies.TOKEN
              })
              .then(function (response) {
                if(response.data.result!=1){
                    res.redirect(obj.domain);
                }else{
                    next();
                }
              })
              .catch(function (error) {
                res.redirect(obj.domain);
            });
        }
    }

    app.get("/administrator", checkAdministrator , function(req, res){
        res.render("administrator", {page:"home",title:"Welcome to administrator"});
    });

    app.get("/administrator/category", checkAdministrator , function(req, res){
        res.render("administrator", {page:"category", title:"Category"});
    });

    app.get("/administrator/sub-category", checkAdministrator , function(req, res){
        res.render("administrator", {page:"subcategory", title:"Foods"});
    });

    app.get("/administrator/options", checkAdministrator , function(req, res){
        res.render("administrator", {page:"option", title:"Food Options"});
    });

    app.get("/administrator/config", checkAdministrator , function(req, res){
        res.render("administrator", {page:"config", title:"Config"});
    });

    app.get("/administrator/note", checkAdministrator , function(req, res){
        res.render("administrator", {page:"note", title:"Note"});
    });

    // Config
    app.post("/config/uploadLogo", checkAdministrator,  function(req, res){
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                res.json({result:0, message:"A Multer error occurred when uploading."});
            } else if (err) {
                res.json({result:0, message:"An unknown error occurred when uploading."});
            }else{
                console.log(req.file); // Thông tin file đã upload
                res.json({result:1, message:"Upload is sucessfully", fileName:req.file.filename});
            }
        });
    });

    app.post("/config/data", function(req, res){
        Config.findOne({}, function(e, row){
            console.log(row);
            if(e || row==null){
                res.json({result:0, message:"Error"});
            }else{
                res.json({result:1, message:"Okay", info:row});
            }
        });
    });

    app.post("/config/update", checkAdministrator, function(req, res){
        if(!req.body.line1 || !req.body.line2 || !req.body.line3 || !req.body.abn || !req.body.numberPrint){
            res.json({result:0, message:"Lack of params"});
        }else{
            Config.findOne({}, function(e, row){
                if(e || row==null){
                    res.json({result:0, message:"Error"});
                }else{
                    row.line1 = req.body.line1;
                    row.line2 = req.body.line2;
                    row.line3 = req.body.line3;
                    row.abn = req.body.abn;
                    row.numberPrint = parseInt(req.body.numberPrint);
                    row.save(function(err){
                        if(err || row==null){
                            res.json({result:0, message:"Update config error"});
                        }else{
                            res.json({result:1, message:"Update config is Okay"});
                        }
                    });
                }
            });
        }
        
    });

    app.post("/config/updateLogo", checkAdministrator, function(req, res){
        if(!req.body.logo){
            res.json({result:0, message:"Lack of params"});
        }else{
            Config.findOne({}, function(e, row){
                if(e || row==null){
                    res.json({result:0, message:"Error"});
                }else{
                    row.logo = req.body.logo;
                    row.save(function(err){
                        if(err || row==null){
                            res.json({result:0, message:"Update logo error"});
                        }else{
                            res.json({result:1, message:"Update logo is Okay"});
                        }
                    });
                }
            });
        }
        
    });

    app.post("/config/updateNote", checkAdministrator, function(req, res){
        if(!req.body.note){
            res.json({result:0, message:"Lack of params"});
        }else{
            Config.findOne({}, function(e, row){
                if(e || row==null){
                    res.json({result:0, message:"Error"});
                }else{
                    row.note = req.body.note;
                    row.save(function(err){
                        if(err || row==null){
                            res.json({result:0, message:"Update config error"});
                        }else{
                            res.json({result:1, message:"Update config is Okay"});
                        }
                    });
                }
            });
        }
    });

    // Orders
    app.post("/order/new", function(req, res){

        var orderType = parseInt(req.body.orderType);

        var customerName = "";
        if(!req.body.customerName){customerName = ""}else{customerName = req.body.customerName;}

        var companyName = "";
        if(!req.body.companyName){companyName = ""}else{companyName = req.body.companyName;}

        var status=0;
        if(!req.body.status){status = 0}else{status = parseInt(req.body.status);}

        var totalOrderSubs=0;
        if(!req.body.totalOrderSubs){totalOrderSubs = 0}else{totalOrderSubs = parseFloat(req.body.totalOrderSubs);}

        var totalOrders_Discount=0;
        if(!req.body.totalOrders_Discount){totalOrders_Discount = 0}else{totalOrders_Discount = parseFloat(req.body.totalOrders_Discount);}

        var totalOrders_Final=0;
        if(!req.body.totalOrders_Final){totalOrders_Final = 0}else{totalOrders_Final = parseFloat(req.body.totalOrders_Final);}

        var totalOrders_MoneyFromCust=0;
        if(!req.body.totalOrders_MoneyFromCust){totalOrders_MoneyFromCust = 0}else{totalOrders_MoneyFromCust = parseFloat(req.body.totalOrders_MoneyFromCust);}

        var totalOrders_MoneyBack=0;
        if(!req.body.totalOrders_MoneyBack){totalOrders_MoneyBack = 0}else{totalOrders_MoneyBack = parseFloat(req.body.totalOrders_MoneyBack);}

        var note="";
        if(!req.body.note){note = ""}else{note = req.body.note;}

        var pickup_hour=-1;
        if(!req.body.pickup_hour){pickup_hour = -1}else{pickup_hour = parseInt(req.body.pickup_hour);}

        var pickup_minute=-1;
        if(!req.body.pickup_minute){pickup_minute = -1}else{pickup_minute = parseInt(req.body.pickup_minute);}

        var arrOptionServer = [];
        req.body.arrOption.forEach(function(op){
            var key = parseInt(op.key);
            var opJson = JSON.parse(op.string);
            arrOptionServer[key] = opJson;
        });
        console.log(222222);
        console.log(arrOptionServer);
        arrOptionServer.forEach(function(taxO){
            taxO.forEach(function(taxXX){
                if(taxXX.tax!=""){
                    var tax = taxXX.tax.replace(")", "");
                    tax = tax.replace("(", "");
                    
                    tax = parseInt(tax);
                  
                    taxXX.tax = tax;
                }else{taxXX.tax = 0;}
            });
        });

        if(!req.body.arrFood){
            res.json({result:0, message:"Lack of parameters"});
        }else{
            var arryFood_Server = [];
            
            req.body.arrFood.forEach(function(itemFood, keyFood){
                console.log(itemFood);
                var tax = "";
                if(itemFood.tax!=""){
                    tax = itemFood.tax.replace(")", "");
                    tax = tax.replace("(", "");
                    console.log(tax);
                    tax = parseInt(tax);
                }
                
                arryFood_Server.push({
                    name:itemFood.name,
                    amount:itemFood.amount,
                    price:itemFood.price,
                    discount:itemFood.discount,
                    tax:tax,
                    _idCate:itemFood._id,
                    lastPrice:itemFood.priceRoot,
                    taxCounting:itemFood.taxCounting,
                    priceInOrder:itemFood.lastPrice,
                    options:arrOptionServer[keyFood]
                });
            });
            var newOrder = new Order({
                orderType:orderType, //   1 le, 2 si, 3 phone
                customerName:customerName, // ten nguoi order
                companyName:companyName, //  ten cong ty order
                totalOrderSubs:totalOrderSubs,
                totalOrders_Discount:totalOrders_Discount,
                totalOrders_Final:totalOrders_Final,
                
                note:note,
                // status = -1 tien mat
                moneyAmount_customer:totalOrders_MoneyFromCust,
                moneyAmount_back:totalOrders_MoneyBack,
    
                categoryList:arryFood_Server,

                pickup_hour:pickup_hour,
                pickup_minute:pickup_minute,

    
                dateCreated:Date.now(),
    
                status:status  // 0 chua thanh toan, 1 thanh toan CASH, 2 thanh toan VISA
            });
    
            
            //res.json({result:1, message:"Create order successfully"});
    
            newOrder.save(function(e){
                if(e){
                    res.json({result:0, message:"Wrong orders"});
                    
                }else{
                    createOrderCode(newOrder._id).then(()=>{
                        res.json({result:1, message:"Create order successfully", orderInfo:newOrder});
                    });
                    
                }
            });
        }
       
    });

    var createOrderCode = function(_idOrder){
        return new Promise((resolve, reject)=>{
            Order.findById(_idOrder, function(e, row){
                if(!e){
                    var codeNo = "";
                    if(row.orderType==1){
                        codeNo += "T" + row.orderingOrder;
                    }
                    if(row.orderType==2){
                        codeNo += "S" + row.orderingOrder;
                    }
                    if(row.orderType==3){
                        codeNo += "P" + row.orderingOrder;
                    }
                    row.orderCode = codeNo;
                    row.save(function(e){
                        resolve();
                    });
                }else{ resolve() }
            });
        });
    }

    app.post("/orders", function(req, res){
        //Order.find({$or:[{orderType:2}, {orderType:3}]}, function(e, rows){
        Order.find(function(e, rows){
            if(e){
                res.json({result:0, message:"Error"});
            }else{
                res.json({result:1, message:"Successfully", rows:rows});
            }
        });
    });

    app.post("/orders/search/code", function(req, res){
        var params  = {}
        if(req.body.orderCode){
            params = {orderCode:req.body.orderCode};
        }
        Order.find(params, function(e, rows){
            if(e){
                res.json({result:0, message:"Error"});
            }else{
                res.json({result:1, message:"Successfully", rows:rows});
            }
        });
    });

    app.post("/orders/detail", function(req, res){
        if(!req.body.idOrder){
            res.json({result:0, message:"Lack of paramters"});
        }else{
            Order.findById(req.body.idOrder, function(e, order){
                if(e){
                    res.json({result:0, message:"Get order detail error"});
                }else{
                    res.json({result:1, message:"Get order detail successfully", order:order});
                }
            });
        }
    });

    app.post("/orders/updateStatus", checkAdministrator, function(req, res){
        if(!req.body.idOrder){
            res.json({result:0, message:"Lack of paramters"});
        }else{
            // 0 chua thanh toan, 1 thanh toan CASH, 2 thanh toan VISA
            Order.findByIdAndUpdate(req.body.idOrder, {status:parseInt(req.body.status)}, function(e, order){
                if(e){
                    res.json({result:0, message:"Update order status error"});
                }else{
                    res.json({result:1, message:"Update order status successfully", order:order});
                }
            });
        }
    });

    // Category
    app.post("/administrator/category/addNew", checkAdministrator, function(req, res){
        if(!req.body.Name || !req.body.Active || req.body.Name.trim().length==0){
            res.json({result:0, message:"Lack of parameters"});
        }else{
            var checked = false;
            if(req.body.Active=="true"){checked = true;}
            var name = req.body.Name.trim();

            var newCate = new Category({
                name:name,
                active:checked
            });
            console.log(newCate);
            newCate.save(function(e, row){
                if(e){
                    console.log(e);
                    res.json({result:0, message:"New category has been saved error!"});
                }else{
                    console.log(row);
                    res.json({result:1, message:"New category has been saved successfully", data:row});
                }
            });

        }
    });

    app.post("/administrator/category/list",  checkAdministrator, function(req, res){
        Category.find(function(e, rows){
            if(e){
                res.json({result:0, message:"Get category in database error!"});
            }else{
                res.json({result:1, message:"Get category in database successfully!", rows:rows});
            }
        });
    });

    app.post("/administrator/category/detail", checkAdministrator, function(req, res){
        if(!req.body.idCate){
            res.json({result:0, message:"Lack of parameters"});
        }else{
            Category.findById(req.body.idCate, function(e, row){
                if(e){
                    res.json({result:0, message:"Get category info error"});
                }else{
                    res.json({result:1, message:"Get category info successful", data:row});
                }
            });
        }
    });

    app.post("/administrator/category/update", checkAdministrator, function(req, res){
        if(!req.body.Name || !req.body.Active || req.body.Name.trim().length==0 || !req.body.idCate){
            res.json({result:0, message:"Lack of parameters"});
        }else{
            console.log(req.body.Active);
            var checked = false;
            if(req.body.Active=="true"){checked = true;}
            var name = req.body.Name.trim();

            Category.findByIdAndUpdate(req.body.idCate, {
                name:name,
                active:checked
            }, function(e, row){
                if(e){
                    console.log(e);
                    res.json({result:0, message:"Category has been updated error!"});
                }else{
                    console.log(row);
                    res.json({result:1, message:"Category has been updated successfully", data:row});
                }
            });
        }
    });

    app.post("/administrator/category/delete", checkAdministrator, function(req, res){
        if(!req.body.idCate){
            res.json({result:0, message:"Lack of parameters"});
        }else{
            Category.findByIdAndDelete(req.body.idCate, function(e){
                if(e){
                    console.log(e);
                    res.json({result:0, message:"Category has been deleted error!"});
                }else{
                    res.json({result:1, message:"Category has been deleted successfully"});
                }
            });
        }
    });

    // Food
    app.post("/administrator/subcategory/addNew", checkAdministrator, function(req, res){
        if(!req.body.Name || !req.body.Active || req.body.Name.trim().length==0
            || !req.body.price_single || !req.body.price_multiple  || !req.body.tax 
            || !req.body._idCategory 
        ){
            res.json({result:0, message:"Lack of parameters"});
        }else{
            var checked = false;
            if(req.body.Active=="true"){checked = true;}
            var name = req.body.Name.trim();

            var newSubCate = new SubCategory({
                _idCategory:req.body._idCategory,
                name:name,
                active:checked,
                price_single:parseFloat(req.body.price_single),
                price_multiple:parseFloat(req.body.price_multiple),
                tax:parseFloat(req.body.tax)
            });
            newSubCate.save(function(e, row){
                if(e){
                    console.log(e);
                    res.json({result:0, message:"New food has been saved error!"});
                }else{
                    res.json({result:1, message:"New food has been saved successfully", data:row});
                }
            });

        }
    });

    app.post("/administrator/subcategory/list",  checkAdministrator, function(req, res){
        SubCategory.find(function(e, rows){
            if(e){
                res.json({result:0, message:"Get Foods in database error!"});
            }else{
                res.json({result:1, message:"Get Foods in database successfully!", rows:rows});
            }
        });
    });

    app.post("/administrator/subcategory/detail", checkAdministrator, function(req, res){
        if(!req.body.idSubCate){
            res.json({result:0, message:"Lack of parameters"});
        }else{
            SubCategory.findById(req.body.idSubCate, function(e, row){
                if(e){
                    res.json({result:0, message:"Get Food info error"});
                }else{
                    res.json({result:1, message:"Get foods info successful", data:row});
                }
            });
        }
    });

    app.post("/administrator/subcategory/update", checkAdministrator, function(req, res){
        if(!req.body.Name || !req.body.Active || req.body.Name.trim().length==0
            || !req.body.price_single || !req.body.price_multiple  || !req.body.tax 
            || !req.body._idCategory || !req.body.idSubCate
        ){
            res.json({result:0, message:"Lack of parameters"});
        }else{
            var checked = false;
            if(req.body.Active=="true"){checked = true;}

            var name = req.body.Name.trim();

            SubCategory.findByIdAndUpdate(req.body.idSubCate, {
                _idCategory:req.body._idCategory,
                name:name,
                active:checked,
                price_single:parseFloat(req.body.price_single),
                price_multiple:parseFloat(req.body.price_multiple),
                tax:parseFloat(req.body.tax)
            }, function(err){
                if(err){
                    console.log(err);
                    res.json({result:0, message:"New food has been updated error!"});
                }else{
                    res.json({result:1, message:"New food has been updated successfully"});
                }
            });

        }
    });

    app.post("/administrator/subcategory/delete", checkAdministrator, function(req, res){
        if(!req.body.idSubCate){
            res.json({result:0, message:"Lack of parameters"});
        }else{
            SubCategory.findByIdAndDelete(req.body.idSubCate, function(e){
                if(e){
                    console.log(e);
                    res.json({result:0, message:"Food has been deleted error!"});
                }else{
                    res.json({result:1, message:"Food has been deleted successfully"});
                }
            });
        }
    });

    // Options
    app.post("/administrator/options/addNew", checkAdministrator, function(req, res){
        if(!req.body.Name || !req.body.Active || req.body.Name.trim().length==0
            || !req.body.price_single || !req.body.price_multiple  || !req.body.tax 
            || !req.body._idCategory 
        ){
            res.json({result:0, message:"Lack of parameters"});
        }else{
            var checked = false;
            if(req.body.Active=="true"){checked = true;}
            var name = req.body.Name.trim();

            var newSubCate = new Option({
                _idSubCate:req.body._idCategory,
                name:name,
                active:checked,
                price_single:parseFloat(req.body.price_single),
                price_multiple:parseFloat(req.body.price_multiple),
                tax:parseFloat(req.body.tax)
            });
            newSubCate.save(function(e, row){
                if(e){
                    console.log(e);
                    res.json({result:0, message:"New option has been saved error!"});
                }else{
                    res.json({result:1, message:"New option has been saved successfully", data:row});
                }
            });

        }
    });

    app.post("/administrator/options/list",  checkAdministrator, function(req, res){
        Option.find(function(e, rows){
            if(e){
                res.json({result:0, message:"Get Foods in database error!"});
            }else{
                res.json({result:1, message:"Get Foods in database successfully!", rows:rows});
            }
        });
    });

    app.post("/administrator/options/detail", checkAdministrator, function(req, res){
        if(!req.body.idOption){
            res.json({result:0, message:"Lack of parameters"});
        }else{
            Option.findById(req.body.idOption, function(e, row){
                if(e){
                    res.json({result:0, message:"Get Option info error"});
                }else{
                    res.json({result:1, message:"Get Option info successful", data:row});
                }
            });
        }
    });

    app.post("/administrator/options/update", checkAdministrator, function(req, res){
        if(!req.body.Name || !req.body.Active || req.body.Name.trim().length==0
            || !req.body.price_single || !req.body.price_multiple  || !req.body.tax 
            || !req.body._idCategory || !req.body.idOption
        ){
            res.json({result:0, message:"Lack of parameters"});
        }else{
            var checked = false;
            if(req.body.Active=="true"){checked = true;}
            var name = req.body.Name.trim();

            Option.findByIdAndUpdate(req.body.idOption, {
                _idSubCate:req.body._idCategory,
                name:name,
                active:checked,
                price_single:parseFloat(req.body.price_single),
                price_multiple:parseFloat(req.body.price_multiple),
                tax:parseFloat(req.body.tax)
            }, function(e){
                if(e){
                    console.log(e);
                    res.json({result:0, message:"New option has been updated error!"});
                }else{
                    res.json({result:1, message:"New option has been updated successfully"});
                }
            });


        }
    });

    app.post("/administrator/options/delete", checkAdministrator, function(req, res){
        if(!req.body.idSubCate){
            res.json({result:0, message:"Lack of parameters"});
        }else{
            Option.findByIdAndDelete(req.body.idSubCate, function(e){
                if(e){
                    console.log(e);
                    res.json({result:0, message:"Option has been deleted error!"});
                }else{
                    res.json({result:1, message:"Option has been deleted successfully"});
                }
            });
        }
    });
    
    //authentication
    app.post("/login", function(req, res){
        if(!req.body.username || !req.body.password){
            res.json({result:0, message:"Lack of parameters"});
        }else{
            var un = req.body.username.trim();
            var pw = req.body.password;
            User.findOne({username:un}).then((user)=>{
                if(user==null){
                    res.json({result:0, message:"Username is not exists"});
                }else{
                    bcrypt.compare(pw, user.password, function(err, resB) {
                        if(err || resB===false){
                            res.json({result:0, message:"Password is invalid"});
                        }else{
                            user.password = "";
                            jwt.sign({
                                data: user
                            }, secretTokenNo, { expiresIn: 60 * 60 }, function(e2, token){
                                if(e2){
                                    res.json({result:0, message:"Token is checked failed"});
                                }else{
                                    var newToken = new Token({
                                        idUser:user._id,
                                        token:token,
                                        dateCreated:Date.now(),
                                        status:true,
                                        userType:user.userType
                                    });
                                    newToken.save().then((result, e)=>{
                                        if(e){ 
                                            console.log(e);
                                            res.json({result:0, message:"Token is saved failed -1"}); 
                                        }else{
                                            res.json({result:1, message:"Login is successfully", token:token});
                                        }
                                    }).catch((e2)=>{
                                        res.json({result:0, message:"Token is saved failed -2"});
                                    });
                                }
                            });
                        }
                    });
                }
            }).catch((e)=>{
                res.json({result:0, message:"Error user info."});
            });;
        }
    });

    app.post("/verify", function(req, res){
        if(!req.body.token){
            res.json({result:0, message:"Lack of parameters"});
        }else{
            var token = req.body.token;
            Token.findOne({token:token, status:true})
            .then((tokenRes, err)=>{
                if(err){
                    res.json({result:0, message:"Token is invalid"});
                }else{
                    if(tokenRes==undefined){
                        res.json({result:0, message:"Token is invalid"});
                    }else{
                        res.json({result:1, message:"Token is right"});
                    }
                }
            })
            .catch((e2)=>{res.json({result:0, message:"Token is invalid"});});
        }
    });

    app.post("/verifyAdministrator", function(req, res){
        if(!req.body.token){
            res.json({result:0, message:"Lack of parameters"});
        }else{
            var token = req.body.token;
            Token.findOne({token:token, status:true})
            .then((tokenRes, err)=>{
                if(err){
                    res.json({result:0, message:"Token is invalid"});
                }else{
                    if(tokenRes==undefined){
                        res.json({result:0, message:"Token is invalid"});
                    }else{
                        jwt.verify(token, secretTokenNo, function(err, decoded) {
                            if(err || decoded==undefined){
                                res.json({result:0, message:"Token is invalid 2"});
                            }else{

                                if(decoded.data.userType!=1){
                                    res.json({result:0, message:"You are not administrator"});
                                }else{
                                    res.json({result:1, message:"Token is right"});
                                }
                            }
                        });
                        
                    }
                }
            })
            .catch((e2)=>{res.json({result:0, message:"Token is invalid"});});
        }
    });
}