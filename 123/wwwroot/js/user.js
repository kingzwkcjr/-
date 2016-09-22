/**
 * Created by Administrator on 2016/9/20.
 */
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
                alert('132')
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




//    $('form').submit(function(ev){
//        ev.preventDefault()
//        //var data = $(this).serialize()
//        var data = new FormData(this)
//        $.post({url:'/user/photo',
//               data:data,
//            contentType:false,   //阻止默认上传方式
//            processData:false,   //默认发送到服务器的数据，会发生数据转换，放置自动转换数据格式
//            success: function (res) {
//                $('.modal.body').text(res.message)
//                $('modal').modal('show').on('hidden.bs.modal', function () {
//                    if(res.code =='success'){
//                        location.href = '/'
//                    }
//                })
//            }
//
//
//        })
//
//})


    $('form').submit(function(ev){
        ev.preventDefault()
        var data = new FormData(this)
        $.post({
            url:'/user/photo',
            data:data,
            contentType:false,  //默认的格式是 application/x-www-form-urlencoded
            processData:false, // 默认发送到服务器的数据，会发生数据转换，防止自动转换数据格式
            success:function(res){
                //$('.modal-body').text(res.message)
                //$('.modal').modal('show').on('hidden.bs.modal', function(){
                    if(res.code == 'success'){
                        location.href = '/'
                    }

                //})
            }

        })
    })



})
