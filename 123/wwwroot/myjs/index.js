$(function(){
    console.log($.cookie())
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

    $.get('/question',function(res){
        console.log(res)
        //var data = res
        //var mess = '[' + data + ']'
        ////var arr = JSON.parse(mess)
        //for(var i = 0; i < data.length; i++){
        //    $('#count').html(mess)
        //}

        var datas = res.questions
        var divs = ''
        console.log(datas)

        //遍历去除所有的提问内容
        for (var i = 0; i < datas.length; i++){
            //datas[i] ----每个文件的内容  ---文件的名称：按时间取名
            var times = datas[i].time2
            var fileName = new Date(times).getTime()
            console.log(fileName)
            divs +="<div class='main' questions='" + fileName + "'>"
            divs +="<section>"
            divs +="<img src='uploads/" + datas[i].petname + ".jpg' />"
            divs +="</section>"
            divs +="<section>"
            divs +="<h4>"+ datas[i].petname + "</h4>"
            divs += "<p>" + datas[i].count + "</p>"
            divs +="<p>" + datas[i].time + "</p>"
            divs +="</div>"
            divs +="</div>"

            //time = datas[i].time
            //console.log(new Date(time))
        }
        $('main').html(divs)
        $('.main').click(function(){
            $.cookie('questions',$(this).attr('questions'))
            location.href = 'answer.html'
        })

    })





    //$('img').attr('src','../uploads/' + username + '.jpg')




})
//var xhr = new XMLHttpRequest()
//xhr.onreadystatechange = function () {
//   if( xhr.readyState == 4 ){
//       console.log(xhr.responseText)
//   }
//}
















