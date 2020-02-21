$(document).ready(function(){
    
    /* --- Отправка заказа --- */
    $("#order-form").submit(function(e){
        e.preventDefault();         
        var data = $(this).serialize();
        $.ajax({
            url: 'index.php?route=checkout/confirm',
            type: "POST",
            data: data,
            success: function(json){
                if(json['flag_order']==true){
                    $("#confirmModalTitle").html("Ваш заказ принят");
                    $("#confirmModalBody").html(
                        "<p>Номер вашего заказа: <b>"+json['order_id']+"</b></p>" +
                        "<p>Мы свяжемся с Вами в ближайшее время, проконсультируем по всем вопросам. При необходимости заказ можно изменить или дополнить товарами!</p>"
                    );
                    yaCounter46338096.reachGoal('th38order');
                }else{
                    $("#confirmModalTitle").html("Обработка заказа");
                    $("#confirmModalBody").html("<p class='class=\'text-danger\''>Произошла ошибка при обработке заказа! Пожалуйста свяжитесь с нами по телефону или через форму онлайн-консультации!</p>");
                }

                $("#orderForm").modal("hide");        
                $("#orderConfirm").modal("show");
                $("#order-form").trigger('reset');
                $(".cart_blocks").remove();
                $("#tableCartProducts").html("<p>Заказ оформлен!</p>");
                setTimeout(function(){
                    $("#orderConfirm").modal("hide");            
                }, 4000);  
            }
        });              
        return false;
    });
    


    /* --- Обратный звонок --- */
    $("#callback-form").submit(function(e){
        e.preventDefault();         
        var data = $(this).serialize();
        $.ajax({
            url: 'index.php?route=thule/callback',
            type: "POST",
            data: data,
            success: function(){
                $("#callBack").modal("hide");
                $("#orderConfirm").modal("show");
                $("#callback-form").trigger('reset');
                setTimeout(function(){
                    $("#orderConfirm").modal("hide"); 
                }, 4000);
                yaCounter46338096.reachGoal('th38callback');
            }
        });      
        return false;
    });


    /* --- Открытие меню на мобильном --- */
    $("#tgMenu").click(function(){
        $("#mMenu").toggleClass("toogle");
    });


    /*-- Favicon --*/
    var xico = false;
    var ico = $("#x-icon");
    setInterval(function(){       
       if (xico) fav = "2"; else fav = "";
       ico.attr("href", "favicon"+fav+".ico"); 
       xico = !xico;      
    }, 2000);

});

