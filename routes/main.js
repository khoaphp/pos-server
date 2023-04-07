const axios = require('axios');
const Token = require("../models/Token");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const Option = require("../models/Option");

module.exports = function(app, obj, randomString, secretTokenNo) {

    app.get("/install", function(req, res){
        res.render("install", {cus:"single"});
    });

    app.get("/dashboard", function(req, res){
        if(req.cookies.TOKEN==undefined){
            console.log("e1");
            res.redirect("./");
        }else{

            axios.post(obj.domain + '/verify', {
                token:req.cookies.TOKEN
              })
              .then(function (response) {
                if(response.data.result!=1){
                    res.redirect("./");
                }else{
                    res.render("dashboard", {cus:"single"});
                }
              })
              .catch(function (error) {
                console.log(error);
                res.redirect("./");
            });
            
        }
        //onsole.log('Cookies: ', req.cookies.TOKENXXXXX);
    });

    app.get("/dashboard-2", function(req, res){
        if(req.cookies.TOKEN==undefined){
            res.redirect("./");
        }else{

            axios.post(obj.domain + '/verify', {
                token:req.cookies.TOKEN
              })
              .then(function (response) {
                if(response.data.result!=1){
                    res.redirect("./");
                }else{
                    res.render("dashboard", {cus:"multiple"});
                }
              })
              .catch(function (error) {
                console.log(error);
                res.redirect("./");
            });
            
        }
        //onsole.log('Cookies: ', req.cookies.TOKENXXXXX);
    });

    app.get("/dashboard-3", function(req, res){
        if(req.cookies.TOKEN==undefined){
            res.redirect("./");
        }else{

            axios.post(obj.domain + '/verify', {
                token:req.cookies.TOKEN
              })
              .then(function (response) {
                if(response.data.result!=1){
                    res.redirect("./");
                }else{
                    res.render("dashboard", {cus:"phone"});
                }
              })
              .catch(function (error) {
                console.log(error);
                res.redirect("./");
            });
            
        }
        //onsole.log('Cookies: ', req.cookies.TOKENXXXXX);
    });

    app.get("/orders", function(req, res){
        if(req.cookies.TOKEN==undefined){
            console.log("e1");
            res.redirect("./");
        }else{

            axios.post(obj.domain + '/verify', {
                token:req.cookies.TOKEN
              })
              .then(function (response) {
                if(response.data.result!=1){
                    res.redirect("./");
                }else{
                    res.render("orders");
                }
              })
              .catch(function (error) {
                console.log(error);
                res.redirect("./");
            });
            
        }
        //onsole.log('Cookies: ', req.cookies.TOKENXXXXX);
    });

    app.get("/", function(req, res){
        res.render("login");
    });

    app.post("/category/list", function(req, res){
        Category.find({active:true}).sort({ordering:1}).exec(function(e, rows){
            if(e){
                res.json({result:0, message:"Error"});
            }else{
                res.json({result:1, message:"Success", rows:rows});
            }
        });
    });

    app.post("/subcategory/list", function(req, res){
        if(!req.body.idCate){
            res.json({result:0, message:"Lack of parameters"});
        }else{
            SubCategory.find({active:true, _idCategory:req.body.idCate}).sort({ordering:1}).exec(function(e, rows){
                if(e){
                    res.json({result:0, message:"Error"});
                }else{
                    res.json({result:1, message:"Success", rows:rows});
                }
            });
        }
    });

    app.post("/subcategorySearch/list", function(req, res){
        if(!req.body.word){
            res.json({result:0, message:"Lack of parameters"});
        }else{
            SubCategory.find({active:true,  name: { $regex: req.body.word, $options: "i" } }).sort({ordering:1}).exec(function(e, rows){
                if(e){
                    res.json({result:0, message:"Error"});
                }else{
                    res.json({result:1, message:"Success", rows:rows});
                }
            });
        }
    });

    app.post("/option/list", function(req, res){
        if(!req.body.idSubCate){
            res.json({result:0, message:"Lack of parameters"});
        }else{
            Option.find({active:true, _idSubCate:req.body.idSubCate}).sort({ordering:1}).exec(function(e, rows){
                if(e){
                    res.json({result:0, message:"Error"});
                }else{
                    res.json({result:1, message:"Success", rows:rows});
                }
            });
        }
    });


}