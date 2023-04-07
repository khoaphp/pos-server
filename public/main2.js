window.onload = function onLoad() {
    install("#progress", 28);
    install("#progress2", 1);
    install("#progress3", 24);
};

countx(0, ".o", 0.01);
countx(0, ".o2", 0.001);
countx(0, ".o3", 0.0001);

function countx(count, nameClass, time){
    if(count<100){
        setTimeout(()=>{
            count = count + 100/(1000*60*60*time) ;
            $(nameClass).html(count.toFixed(4) + "%");
            countx(count, nameClass, time);
        }, 1000);
    }else{
        $(nameClass).html("Done");
    }
}

function install(id, time){
    var circle = new ProgressBar.Circle(id, {
        color: '#555',
        trailColor: '#eee',
        strokeWidth: 10,
        duration: 2500,
        easing: 'easeInOut'
    });

    circle.set(0.05);

    setTimeout(function() {
        circle.animate(1);
    }, 1000*60*60*time);
}