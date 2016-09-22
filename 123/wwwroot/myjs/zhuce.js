$(function(){

    $('form').submit(function (ev) {
        ev.preventDefault()
        var pass = $(':password').map(function(){
            return $(this).val()
        })
        if(pass[0] == pass[1]){

            console.log('两次密码一致，允许提交')
            var data = $(this).serialize()
            $.post('/user/zhuce',data,function(res){
                console.log(res)
                //alert{res.message}

                if(res.code == 'success'){

                    //location.href = 'login.html'

                    $('#success').modal('show')
                    $('#sure').click(function(){
                        location.href = 'login.html'
                    })
                }
            })
        }else{
            alert('两次密码不一致请重新输入')
            $('#false').modal('show')
        }
    })
})
