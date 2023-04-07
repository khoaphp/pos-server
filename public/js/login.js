$(document).ready(function(){

    $("#counting").fadeOut(0);

    $("#btnSignIn").click(function(){
      var un = $("#floatingInput").val();
      var pw = $("#floatingPassword").val();
      $.post("/login", {username:un, password:pw}, function(data){
        console.log(data);
        if(data.result!=1){
            $("#message").css("color", "red");
            $("#message").html(data.message);
        }else{
            setCookie("TOKEN", data.token,10);
            $("#message").css("color", "green");
            $("#message").html(data.message);
            startToCount();
        }
      });
    });
});

function startToCount(){
    $("#counting").fadeIn(500);
    timeCounting(5);
}

function timeCounting(time){
    if(time<0){
        window.location = "./dashboard";
    }else{
        $("#timing").html(time);
        time = time -1;
        setTimeout(()=>{ timeCounting(time) }, 1000);
    }
}