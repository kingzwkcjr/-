$(function(){
    //console.log($.cookie())
    var username = $.cookie('username')
    if(username){

        $('.active').click(function(){
            location.href = 'question.html'
        })

        $('.dropdown-toggle').empty()
        $('.dropdown-toggle').attr('data-toggle','dropdown')
        $('<span class="fa fa-user"></span><span id="deng">' + username + '</span> <b class="caret"></b>').appendTo('.dropdown-toggle')
        $('.tuichu').click(function(){
            $.get('/user/signout',null,function(res){
                console.log('132')
                if( res.code == 'success'){
                    location.href = '/'
                }
            })


        })
    }else{

        $('.active').click(function(){
            location.href = 'login.html'
        })
        $('.dropdown').click(function(){
            location.href = 'login.html'
        })
    }




    $('form').submit(function(ev){
        console.log('111')
        ev.preventDefault()
        var data = $(this).serialize()
        console.log(data)
        $.post('/answer',data,function(res){

            console.log(res)
            //if(res.code == 'success') {
                location.href = '/'
            //}
        })
    })

    console.log($.cookie())
})






















