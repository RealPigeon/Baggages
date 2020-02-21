$(document).ready(function(){
    
    /* --- Подборник --- */
    $("#filterForm button[type='reset']").click(function(e){
        $("#filterRoof>div").addClass("disabled");
        $("#filterRoof input").prop("disabled", true);
        $("#filterForm input").prop("checked", false);
        $("#filterForm input").removeAttr("checked");

        $("#filterCar option").attr("selected", false);
        $("#filterYear option").attr("selected", false);

        $("#filterCar option:first-child").prop("selected", true);
        $("#filterYear option:first-child").prop("selected", true);        
        $("#filterModel").empty();
        $("#filterModel").append('<option value="0">Выберите модель</option>');
        $("#filterModel").prop("disabled", true);        
    });

    $("#filterYear, #filterCar").change(function(){
        var year = $("#filterYear").val();
        var car =  $("#filterCar").val();        
        
        $("#filterModel").prop("disabled", true);
        $("#filterModel").empty();
        $("#filterModel").append('<option value="0">Выберите модель</option>');
        $("#filterModel option:first-child").prop("selected", true);

        $("#filterRoof>div").addClass("disabled");
        $("#filterRoof input").prop("disabled", true);
        $("#filterRoof input").prop("checked", false); 

        if (year!=0 && car!=0) {              
            $.ajax({
                url: 'index.php?route=product/category/getcarmodels',
                type: "POST",
                data: "car_id="+car+"&year="+year,
                dataType: 'json',
                success: function(json){                       
                    if (json["error"]) {
                      alert("Произошла ошибка. Обратитесь к администратору сайта!");
                    }else{
                        $.each(json["models"],function(index, value){
                          $("#filterModel").append("<option value='"+value["model_id"]+"'>"+value["name"]+"</option>");
                        });
                        $("#filterModel").prop("disabled", false);                        
                    }
                }
            });
        }else{            
          $("#filterModel").prop("disabled", true);          
        }
    });

    $("#filterModel").change(function(){
        var val = $(this).val();
        if (val!=0) {
            var fr = $("#filterRoof");
            fr.empty();
            $.ajax({
                url: 'index.php?route=product/category/getroofs',
                type: "POST",
                data: "model_id="+val,
                dataType: 'json',
                beforeSend: function() {
                    fr.addClass('load');
                },
                complete: function() {                
                    fr.removeClass('load');
                },
                success: function(json){                       
                    if (json["error"]) {
                      alert("Произошла ошибка. Обратитесь к администратору сайта!");
                    }else{
                        $.each(json["roofs"],function(index, value){
                          fr.append("<div class='radio'><label><input type='radio' required='required' name='filter_roof' value='"+value["roof_id"]+"'>"+value["name"]+"<img src='"+value["image"]+"'></label></div>");
                        });
                        $("input[name='filter_roof']").change(function(){
                            searchProductsModel();
                        });
                    }
                }
            });
        }else{
          $("#filterRoof>div").addClass("disabled");
          $("#filterRoof input").prop("disabled", true);
          $("#filterRoof input").prop("checked", false); 
        }
    });

    $(".catalog__goodlist-color a").click(function(){
        var img = $(this).attr("image");
        var p = $(this).attr("price");
        if (img!="") {
            $("#img"+$(this).attr("pid")).attr("src", img);
        }
        if (p!="") {
            $("#price"+$(this).attr("pid")).html(p);
        }  
        $("a.clr"+$(this).attr("pid")).removeClass("active");
        $(this).addClass("active");
    });

    function searchProductsModel(){
        var pl = $("#productList");
        pl.empty();
        var data = $("#filterForm form").serialize(); 
        $.ajax({
            url: 'index.php?route=product/category/sets',
            type: "POST",
            data: data,
            dataType: 'html',
            beforeSend: function() {
                pl.css('min-height', '200px');
                pl.addClass('load');
            },
            complete: function() {                
                var d = pl.offset().top;
                $('html, body').animate({ scrollTop: d }, 350);                            
            },
            success: function(html){                                                                       
                setTimeout(function(){
                    pl.append(html);
                    pl.removeClass('load');
                },500);
                yaCounter46338096.reachGoal('th38podbor');             
            }
        });
    }
});


/* --- Добавить комплект в корзину --- */
function setToCart(data, key) {
    var flag = false;
    var i = 0;
    var op = "";
    $.each(data, function(index,value){
        i++;
        if (i==1) {
            op = "&option["+$("#color"+key+" .active").attr("poi")+"]="+$("#color"+key+" .active").attr("povi");
        }
        $.ajax({
            url: 'index.php?route=checkout/cart/add',
            type: 'post',
            data: 'product_id='+value+op,
            dataType: 'json',
            success: function(json) {
                if (json['success']) {
                    flag = true;
                }
                if (json['error']) {
                    flag = false;
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
          });
    });
    //if (flag==true) {
        $("#modalCart").modal('show');
        setTimeout(function(){
            $("#modalCart").modal('hide');
        },5000); 
    //}
}

function setColor($key, $product_option_value_id, $image, $price){
    $('#set'+$key+" ul a").removeClass('active');
    $("#a"+$key+$product_option_value_id).addClass('active');
    if ($image!='') {
        $("#img"+$key).attr("src", $image);
    }
    if ($price!='') {
        $("#sprice"+$key).html($price);
    }
}