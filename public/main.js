var arrFood = [];
var arrOption = [];
var selectdFood = null;

var totalOrderSubs = 0;
var totalOrders_Discount = 0;
var totalOrders_Final = 0;

var totalOrders_MoneyFromCust = null;  // tien nhan cua khach
var totalOrders_MoneyBack = null;       // tien thoi
var totalOrders_Printer = null;         // so luong bang in

var totalOrders_CustomerName = null;    // hoten nguoi order

var currentButton = null;  // 1 cash, 2 card

$(document).ready(function(){
    $("#paymentSingle").fadeOut(0);
    
    loadCate();

    //////////

    $("#btnAddNewItem").click(function(){
        $("#tbOrders").append(`
            <tr>
                <td width="30%">
                    <div class="tbOrders_itemName">
                        Capuchino
                    </div>
                    <div class="tbOrders_Options">
                        Full cream (1.5$), less sugar (0$)
                    </div>
                </td>

                <td width="20%">
                    <div id="tbOrders_total">
                    $ <input type="text" class="tbOrders_price" value="100" />
                    <img src="./btnSave.png" class="btnUpdateDiscount" />
                    </div>
                </td>
                <td width="20%">
                    <div id="tbOrders_total">
                    <input type="text" class="tbOrders_price" placeholder="Discount" />
                    <img src="./btnSave.png" class="btnUpdateDiscount" />
                    </div>
                </td>

                <td width="20%">
                    x <input type="text" class="tbOrders_dicountAmount" value="1" />
                    <img src="./btnSave.png" class="btnUpdateDiscount" />
                </td>
                <td width="10%">
                    <div class="tbOrders_itemName">
                        $153.0
                    </div>
                </td>
            </tr> 
        `);
    });

    $(".subCateItemOption").click(function(){
        // var currentClassname = $(this).attr("class");
        // if(currentClassname.includes("subCateItemHover")){
        //     $(this).removeClass("subCateItemHover");
        // }else{
        //     $(this).addClass("subCateItemHover");
        // }
    });

});

$("#btnNhantienthoi").click(function(){
    totalOrders_MoneyFromCust = parseFloat($("#moneyFromCus").val());
    totalOrders_MoneyBack = totalOrders_MoneyFromCust - totalOrders_Final
    $("#tienthoi").html(totalOrders_MoneyBack.toFixed(2));
});
$("#btnConfirm").click(function(){
    currentButton = 0;
});
$("#btnCash").click(function(){
    currentButton = 1;
    $("#rowCharge").show(0);
    $("#rowCash").show(0);
    $(".tienle").fadeIn(0, function(){
        $("#paymentSingle").fadeIn(500);
    });
    
});
$("#btnCard").click(function(){
    currentButton = 2;
    $("#rowCharge").hide(0);
    $("#rowCash").hide(0);
    $(".tienle").fadeOut(0, function(){
        $("#paymentSingle").fadeIn(500);
    });
    
});
$("#paymentSingle_btnCancel").click(function(){
    $("#paymentSingle").fadeOut(200, function(){
    });
});
$("#paymentSingle_btnFinish").click(function(){
    
    $("#paymentSingle").fadeOut(200, function(){
        //location.reload();
    });
});

///////// START

function itemOption_Struct(name, price, tax, _idOption, fullPrice, taxPrice){
    this.name = name;
    this.price = price;
    this.tax = tax;
    this._idOption = _idOption;
    this.fullPrice = fullPrice;
    this.taxPrice = taxPrice;
}

function itemCategory_Struct(name, amount, price, lastPrice, tax, taxCounting, discount, _idCate, arrayOptions){
    this.name = name;
    this.amount = amount;
    this.price = price;
    this.lastPrice = lastPrice;
    this.tax = tax;
    this.taxCounting = taxCounting;
    this.discount = discount,
    this._idCate = _idCate;
    this.options = arrayOptions;
}

//var food = new itemCategory_Struct("Bread 1111", 2, 11.55, 5, "6417da6f45b889fc6fe12a3c");


$("#paymentSingle_btnFinish").click(function(){
    if(arrFood.length==0){
        alert("Order is empty");
    }else{

        $(".lastItemPrice").each(function(i, obj) {
            var goc = $(this).html().trim()
            goc = goc.replace("$", "");
            var tbOrders_itemName = parseFloat(goc);
            console.log(tbOrders_itemName );
            arrFood[i].lastPrice = tbOrders_itemName
        });

        var arrOp2 = [];
        arrOption.forEach(function(i, key){
            arrOp2.push({string:JSON.stringify(i), key:key});
        });

        console.log(arrFood);

        $.post("./order/new", {
            arrFood:arrFood, arrOption:arrOp2,
            orderType:parseInt($("#orderType").val()),
            customerName:$("#txtOrderName").val(),
            companyName:$("#customersGroup").val(),
            status:currentButton,
            totalOrderSubs:$("#totalOrderSubs").html(),
            totalOrders_Discount:$("#totalOrderDiscount").html(),
            totalOrders_Final:$("#totalOrderSubsFinal").html(),
            totalOrders_MoneyFromCust:totalOrders_MoneyFromCust,
            totalOrders_MoneyBack:totalOrders_MoneyBack,
            note:$("#orderNote").val()
        }, function(data){
            console.log(data);
            if(data.result==1){
                
                var noPrint = parseInt($("#billAmount").val());
                if(noPrint>0){
                    printOrder(data.orderInfo._id, currentButton);
                }else{
                    window.location.reload();
                }
                
            }
        });
    }
});

$("#btnConfirm").click(function(){
    
    if(arrFood.length==0){
        alert("Order is empty");
    }else{
        $(".lastItemPrice").each(function(i, obj) {
            var goc = $(this).html().trim()
            goc = goc.replace("$", "");
            var tbOrders_itemName = parseFloat(goc);
            console.log(tbOrders_itemName );
            arrFood[i].lastPrice = tbOrders_itemName
        });

        var arrOp2 = [];
        arrOption.forEach(function(i, key){
            arrOp2.push({string:JSON.stringify(i), key:key});
        });

        $.post("./order/new", {
            arrFood:arrFood, arrOption:arrOp2,
            orderType:parseInt($("#orderType").val()),
            customerName:$("#txtOrderName").val(),
            companyName:$("#customersGroup").val(),
            status:0,
            totalOrderSubs:$("#totalOrderSubs").html(),
            totalOrders_Discount:$("#totalOrderDiscount").html(),
            totalOrders_Final:$("#totalOrderSubsFinal").html(),
            totalOrders_MoneyFromCust:totalOrders_MoneyFromCust,
            totalOrders_MoneyBack:totalOrders_MoneyBack,
            pickup_hour:$("#slHour").val(),
            pickup_minute:$("#slMinute").val(),
            note:$("#orderNote").val()
        }, function(data){
            console.log(data);
            if(data.result==1){
                //window.location.reload();
                printOrder(data.orderInfo._id, currentButton);
            }
        });
    }
});

$(document).on("click", ".cateItem", function(){
    $("#subCate").html("");
    $("#subCateOptions").html("<h2>Options</h2>");
    var idCate = $(this).attr("_idcate");
    $.post("./subcategory/list", {idCate:idCate}, function(data){
        if(data.result==1){
            var currentType = getCookie("CURRENT_TYPE");
            console.log(currentType);
            data.rows.forEach(function(item){
                
                var price = ""; var tax=""; var realPrice=0;

                if(currentType=="0" || currentType=="2"){
                    price = item.price_single;
                }else{ price = item.price_multiple; }

                if(item.tax>0){
                    tax = "("+item.tax+"%)";
                    realPrice = parseFloat(price - price/100*item.tax).toFixed(2);
                }else{ realPrice = price; }
                $("#subCate").append(`
                <div class="subCateItem" _idSubCate="`+item._id+`" nameSub="`+item.name+`" priceSub="`+realPrice+`" tax="`+tax+`" priceRoot="`+price+`">
                    <p class="foodName">`+item.name+`</p>
                    <p class="foodPrice">$`+price+ `</p>
                </div>
                `);
            });
        }
    });
});

$("#txtSearchFood").keyup(function(){
    var txt = $(this).val().trim();
    if(txt.length>0){
        $("#subCate").html("");
        $.post("./subcategorySearch/list", {word:txt}, function(data){
            if(data.result==1){
                var currentType = getCookie("CURRENT_TYPE");
                console.log(currentType);
                data.rows.forEach(function(item){
                    
                    var price = ""; var tax=""; var realPrice=0;

                    if(currentType=="0" || currentType=="2"){
                        price = item.price_single;
                    }else{ price = item.price_multiple; }

                    if(item.tax>0){
                        tax = "("+item.tax+"%)";
                        realPrice = parseFloat(price - price/100*item.tax).toFixed(2);
                    }else{ realPrice = price; }
                    $("#subCate").append(`
                    <div class="subCateItem" _idSubCate="`+item._id+`" nameSub="`+item.name+`" priceSub="`+realPrice+`" tax="`+tax+`" priceRoot="`+price+`">
                        <p class="foodName">`+item.name+`</p>
                        <p class="foodPrice">$`+price+ `</p>
                    </div>
                    `);
                });
            }
        });
    }else{
        $("#subCate").html("");
    }
});



window.onafterprint = function(){
    console.log("Print xong");
}

$(document).on("click", ".subCateItem", function(){
    $(".subCateItem").removeClass("subCateItemHover");
    $(this).addClass("subCateItemHover");

    // get Options
    $("#subCateOptions").html("<h2>Options</h2>");
    var idSubCate = $(this).attr("_idsubcate");
    var subCate_Name = $(this).attr("namesub");
    var subCate_Price = $(this).attr("pricesub"); // gia chua thue
    var subCate_Tax = $(this).attr("tax");
    var priceroot = $(this).attr("priceroot"); // gia da co thue (nhap tay)

    var lastPrice = $(this).attr("lastPrice");// ko su dung
    var taxCounting = (parseFloat(priceroot) -  parseFloat(subCate_Price)).toFixed(2) ;
    $.post("./option/list", {idSubCate:idSubCate}, function(data){
        if(data.result==1){
            var currentType = getCookie("CURRENT_TYPE");
            data.rows.forEach(function(item){
                var price = ""; var tax=""; var realPrice=0; var taxPrice=0;

                if(currentType=="0" || currentType=="2"){
                    price = item.price_single;
                }else{ price = item.price_multiple; }

                if(item.tax>0){                     //  price (100+tax)
                    tax = item.tax;
                    realPrice = parseFloat( price*100/(100+item.tax)).toFixed(2);
                    taxPrice = parseFloat( price*tax/(100+item.tax)).toFixed(2);
                }else{ realPrice = price; }
                $("#subCateOptions").append(`
                <div class="subCateItemOption" _idSubCate="`+item._id+`" nameSub="`+item.name+`" price="`+price+`" priceSub="`+realPrice+`" tax="`+tax+`" taxPrice="`+taxPrice+`">
                    <p class="foodName">`+item.name+`</p>
                    <p class="foodPrice">$`+price+`</p>
                </div>
                `);
            });
        }
    });

    // add orders
    arrFood.push(
        {_id:idSubCate, name:subCate_Name, 
            price:subCate_Price, // gia chua thue 
            tax:subCate_Tax,
            discount:0, amount:1, 
            priceRoot:priceroot,    // priceroot
            taxCounting:taxCounting
        }
    );
    arrOption.push(
        []
    );
    selectdFood=arrFood.length-1;

    console.log(arrFood);
    console.log(arrOption);

    loadOrders();
});

$(document).on("click", ".subCateItemOption", function(){
    if(selectdFood==null){
        alert("Please choose an item.");
    }else{
        
        // get Options
        var idOption = $(this).attr("_idsubcate");
        var option_Name = $(this).attr("namesub");
        var option_Price = $(this).attr("pricesub");        // 11.82 gia 100%
        var option_Tax = $(this).attr("tax");               // 10    tax% 
        var fullPrice = $(this).attr("price");              // 13
        var taxPrice = $(this).attr("taxprice");            // 1.18  
        // add option
        // if(!optionIsExist(idOption, selectdFood)){
        //     arrOption[selectdFood].push(
        //         {_id:idOption, name:option_Name, price:option_Price, tax:option_Tax, fullPrice:fullPrice, taxPrice:taxPrice}
        //     );
        //     //$(".subCateItemOption").removeClass("subCateItemHover");
        //     $(this).addClass("subCateItemHover");
        // }else{
        //     var key = findOptionInWhichCate(idOption, selectdFood);
        //     if(key!=null){
        //         arrOption[selectdFood].splice(key, 1);
        //         $(this).removeClass("subCateItemHover");
        //     }
        // }
        arrOption[selectdFood].push(
            {_id:idOption, name:option_Name, price:option_Price, tax:option_Tax, fullPrice:fullPrice, taxPrice:taxPrice}
        );

        console.log(arrFood);
        console.log(arrOption);
    
        loadOrders();
    }
    
});

// $(document).on("click", ".btnUpdateAmount", function(){
//     var chosenOrdering = $(this).attr("orderinarray");
//     if(parseInt(chosenOrdering)>=0 && arrFood.length>0){
//         var amount = $(this).prev().val();
//         amount = parseInt(amount);
//         if(amount<1){
//             amount = 1;
//         }
//         arrFood[chosenOrdering].amount = parseInt(amount);
//         console.log(arrFood);
//         console.log(arrOption);
//         loadOrders();
//     }
// });

$(document).on("keyup", ".tbOrders_dicountAmount", function(){
    if($(this).val()==""){
        $(this).val("0");
    }

    var chosenOrdering = $(this).attr("orderinarray");
    if(parseInt(chosenOrdering)>=0 && arrFood.length>0){
        var amount = $(this).val();
        amount = parseInt(amount);
        if(amount<=0){
            amount = 0;
        }
        arrFood[chosenOrdering].amount = parseInt(amount);
        loadOrders();
        $(".tbOrders_dicountAmount[orderinarray='"+chosenOrdering+"']").focus();
        var tmpStr = $(".tbOrders_dicountAmount[orderinarray='"+chosenOrdering+"']").val();
        $(".tbOrders_dicountAmount[orderinarray='"+chosenOrdering+"']").val('');
        $(".tbOrders_dicountAmount[orderinarray='"+chosenOrdering+"']").val(tmpStr);
    }
});

$(document).on("click", ".rowItem", function(){
    var chosenOrdering = $(this).attr("orderinarray");
    if(parseInt(chosenOrdering)>=0 && arrFood.length>0){
        selectdFood = parseInt(chosenOrdering);
        $(".rowItem").removeClass("currenRowOrders");
        $(this).removeClass("currenRowOrders");
    }else{
        selectdFood = null;
    }
});

$(document).on("click", ".btnUpdateDiscount", function(){
    var chosenOrdering = $(this).attr("orderinarray");
    if(parseInt(chosenOrdering)>=0 && arrFood.length>0){
        var newDiscount = parseInt($(this).prev().val());
        if(newDiscount<=0){
            newDiscount=0; 
        }
        if(newDiscount>=100){
            newDiscount=99; 
        }
        $(this).prev().val(newDiscount);
        
        var oldDiscount = arrFood[chosenOrdering].discount;  //   ==== 100-oldRootPrice

        arrFood[chosenOrdering].priceRoot = (arrFood[chosenOrdering].priceRoot/(100 - oldDiscount)) * (100 - newDiscount);

        arrFood[chosenOrdering].discount=newDiscount;
        //arrFood[chosenOrdering].priceRoot = arrFood[chosenOrdering].priceRoot - (arrFood[chosenOrdering].priceRoot/100*newDiscount);
        loadOrders();
    }
});

$("#btn_UpdateDiscountTotalOrders").click(function(){
    var amountDiscount = parseInt($("#amountTotalDiscount").val());
    if(amountDiscount>=100 || amountDiscount<0){
        amountDiscount = 0;
    }
    totalOrders_Discount = amountDiscount;
    loadOrders();
});

// $(document).on("click", ".btnUpdateSinglePrice", function(){
//     var chosenOrdering = $(this).attr("orderinarray");
//     if(parseInt(chosenOrdering)>=0 && arrFood.length>0){
//         arrFood[chosenOrdering].priceRoot = parseFloat($(this).prev().val()).toFixed(2);
//         loadOrders();
//     }
// });

$(document).on("keyup", ".inOrder_pricePerItem_includeGST", function(){
    if($(this).val()==""){
        $(this).val("0");
    }

    var chosenOrdering = $(this).attr("orderinarray");
    var lastChar = $(this).val().substr($(this).val().length - 1);
    if(lastChar!="."){
        if(parseInt(chosenOrdering)>=0 && arrFood.length>0){
            arrFood[chosenOrdering].priceRoot = parseFloat($(this).val());
            loadOrders();
            $(".inOrder_pricePerItem_includeGST[orderinarray='"+chosenOrdering+"']").focus();
            var tmpStr = $(".inOrder_pricePerItem_includeGST[orderinarray='"+chosenOrdering+"']").val();
            $(".inOrder_pricePerItem_includeGST[orderinarray='"+chosenOrdering+"']").val('');
            $(".inOrder_pricePerItem_includeGST[orderinarray='"+chosenOrdering+"']").val(tmpStr);
        }
    }
        
});

$(document).on("click", ".btnDeleteItem", function(){
    var chon = confirm("Are you sure you want to delete?");
    if(chon){
        var chosenOrdering = $(this).attr("orderinarray");
        if(parseInt(chosenOrdering)>=0 && arrFood.length>0){
            arrFood.splice(chosenOrdering, 1);
            arrOption.splice(chosenOrdering, 1);
            loadOrders();
        }
    }
});

function optionIsExist(idOption, ordersNo){
    var exist = false;

    if(arrOption[ordersNo].length>0){
        arrOption[ordersNo].forEach(function(op){
            if(op._id==idOption){
                exist = true;
            }
        });
    }
    
    return exist;
}

function findOptionInWhichCate(idOption, ordersNo){
    var found = null;
    if(arrOption[ordersNo].length>0){
        arrOption[ordersNo].forEach(function(op, key){
            if(op._id==idOption){
                found = key;
            }
        });
    }
    
    return found;
}



$(document).on("click", ".optionX", function(){
    var keyfood = $(this).attr("keyfood");   
    var _idoption = $(this).attr("_idoption");
    for(var i=0; i<arrOption[keyfood].length; i++){
        if(arrOption[keyfood][i]._id==_idoption){
            arrOption[keyfood].splice(i, 1);
            break;
        }no
    }
    loadOrders();
});

function loadOrders(){
    $("#tbOrders").html("");
    var totalOrderSubs = 0;
    arrFood.forEach(function(item, key){
        //console.log(item);
        var strOption = ""; var itemTotal = 0; var singlePrice = 0; var priceWithGST = 0; var taxPrice = 0; var taxNo = 0;
        arrOption[key].forEach(function(itemOpt){
            strOption += "<div class='optionX' keyfood='"+key+"' _idoption='"+itemOpt._id+"'>";
            strOption += itemOpt.name + " ("+itemOpt.fullPrice+"$) ";
            itemTotal += parseFloat(itemOpt.fullPrice);
            singlePrice += parseFloat(itemOpt.price);
            strOption += "</div>";
        });
        //
        singlePrice += parseFloat(item.price); // gia chua thue
        itemTotal =  (parseFloat(item.priceRoot) + parseFloat(itemTotal)) * parseInt(item.amount);
        totalOrderSubs += itemTotal;
        priceWithGST = parseFloat(item.priceRoot);
        strOption = strOption.substring(0, strOption.length - 2);

        console.log(item.tax);
        taxNo = item.tax.replace("(", "");
        taxNo = taxNo.replace("%)", "");
        taxNo = parseInt(taxNo);

        if(item.tax!=""){
            taxPrice = (priceWithGST/(100 + taxNo) * taxNo).toFixed(2);
        }
        
        arrFood[key].taxCounting = taxPrice;  // tax [1] item
        arrFood[key].price = priceWithGST;        //

        // all orders
        totalOrders_Final = totalOrderSubs - (totalOrderSubs/100*totalOrders_Discount);
        $("#tbOrders").append(`
            <tr _idsubcate="`+item._id+`" class="rowItem" orderInArray="`+key+`">
                <td width="3%">
                    <img src="./delete.webp" class="btnDeleteItem" orderInArray="`+key+`" style="max-width:30px; cursor:pointer" />
                </td>
                <td width="27%">
                    <div class="tbOrders_itemName">
                        `+item.name+`
                    </div>
                    <div class="tbOrders_Options">
                        `+strOption+`
                    </div>
                </td>

                <td width="20%">
                    <div id="tbOrders_total">
                    $ <input type="text" class="tbOrders_price inOrder_pricePerItem_includeGST"  _idsubcate="`+item._id+`"  orderInArray="`+key+`" placeholder="% Discount" value="`+priceWithGST+`" />
                    <!--<img src="./btnSave.png" class="btnUpdateSinglePrice" orderInArray="`+key+`" />-->
                    </div>
                </td>
                <td width="20%">
                    <div id="tbOrders_total">
                    <input type="text" class="tbOrders_price" placeholder="% Discount" value="`+item.discount+`" />
                    <img src="./btnSave.png" class="btnUpdateDiscount" orderInArray="`+key+`" />
                    </div>
                </td>

                <td width="20%">
                    x <input type="text" class="tbOrders_dicountAmount" value="`+item.amount+`"  orderInArray="`+key+`"  _idsubcate="`+item._id+`" />
                    <!--<img orderInArray="`+key+`" src="./btnSave.png" class="btnUpdateAmount" />-->
                </td>
                <td width="10%">
                    <div class="tbOrders_itemName lastItemPrice">
                        $`+itemTotal.toFixed(2)+`
                    </div>
                </td>
            </tr> 
        `);
    });

    $("#totalOrderSubs").html(totalOrderSubs.toFixed(2));
    $("#totalOrderDiscount").html(parseInt(totalOrders_Discount)+ "%");
    $("#totalOrderSubsFinal").html(totalOrders_Final.toFixed(2));

    $("#tongtienInHong").html(totalOrderSubs.toFixed(2));
    
}

function loadCate(){
    $.post("./category/list", function(data){
        if(data.result==1){
            $("#cates").html("");
            data.rows.forEach(function(item){
                $("#cates").append(`
                <div class="cateItem blue" _idCate="`+item._id+`">
                    <p>`+item.name+`</p>
                </div>
                `);
            });
        }
    });
}


function removeLastChar(s) {
    if(s.length>0){
        if (s == null || s.length == 0) {
            return s;
        }
        return s.substring(0, s.length-2);
    }
}