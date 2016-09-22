$(function(){

    $('form').submit(function(ev){
        ev.preventDefault()
        var data = $('form').serialize()
        $.post('/user/login',data,function(res){

            if(res.code == 'success'){
                //alert('登录成功')
                $('#success').modal('show')
                $('#sure').click(function(){
                    location.href = '/'
                })

            }else{
                //alert(res.message)
                $('.tishi').html(res.message)
                $('#false').modal('show')

            }
        })
    })


})