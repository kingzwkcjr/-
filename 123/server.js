var express = require('express')
var bodyParser = require('body-parser')
var multer = require('multer')
var cookieParser = require('cookie-parser')
var fs = require('fs')
var app = express()
var form = multer()
app.use(express.static('wwwroot'))
app.use(bodyParser.urlencoded({extended:false}))

var storage = multer.diskStorage({
    destination:'uploads',
    filename:function(req,file,cb){
        var uname = req.cookies.username
        cb(null,uname + '.jpg')
    }
})
var uploads = multer({storage})

//解析cookie
app.use(cookieParser())
app.post('/user/zhuce',function(req,res){

    var fileName = 'user/' + req.body.username + '.txt'
    function send(code,message){
        res.status(200).json({code,message})
    }
    //创建文件
    function file(){
        fs.exists(fileName,function(exists){
            if(exists){
                //res.send('此用户名已注册')

                send('resgitered','此用户已注册')

            }else{
                fs.appendFile(fileName,JSON.stringify(req.body),function(err,data){
                    if(err){
                        //res.send('系统错误，请重试')
                        send('error','系统错误请重试')
                    }else{
                        //res.send('恭喜您注册成功，请登录')
                        send('success','恭喜您注册成功，请登录')
                    }
                })
            }
        })
    }

    fs.exists('user',function(exists){
        if(!exists){
            fs.mkdirSync('user')
            file()
        }else{
            file()
        }
    })
})


app.post('/user/login',function(req,res){

    var userFile = 'user/' + req.body.username + '.txt'
    function send(code,message){
        res.status(200).json({code,message})
    }
    fs.exists(userFile,function(exists){
        if(!exists){
            send('error','该用户未注册')
        }else{
            fs.readFile(userFile,function(err,data){
                if(err){
                    send('file error','系统错误')
                }else{
                    var use = JSON.parse(data)
                    if(use.password == req.body.password){

                        res.cookie('username',req.body.username)
                        send('success','登录成功')




                    }else{
                        send('false','密码不正确，请重新输入')
                    }
                }
            })
        }
    })


})


//cookie退出请求处理
app.get('/user/signout',function(req,res){

    res.clearCookie('username')
    res.status(200).json({'code':'success'})
})


//文件上传请求
app.post('/user/photo',uploads.single('photo'),function(req,res){


    res.send('chenggong')
})




var datas
setInterval(function(){
    var data = new Date()
    var y = data.getFullYear()
    var m = data.getMonth() + 1
    var d = data.getDate()
    var h = data.getHours()
    var ms = data.getMinutes()
    var ss = data.getSeconds()
    datas = y  + '-' + m  + '-'  + d  + '-'  + h  + '-'  + ms  + '-'  + ss
},1000)







//问题留言

app.post('/user/question',function(req,res){

    //console.log(user)

    //创建文件
    function file(){

        var mess = [
            req.body,
            datas
        ]
        var files = 'data/'+ datas + '.txt'
        var str = JSON.stringify(mess)
        fs.appendFile(files,str,function(err){
            if(err){
                console.log('保存失败')
                res.send('保存失败1')
            }else{
                console.log('保存成功')
                res.send(datas)
            }
        })
    }




    fs.exists('data',function(exists){
        if(!exists){
            fs.mkdirSync('data')
            file()
        }else{
            file()
        }
    })
    //res.send('123')
})

app.get('/user/question', function (req, res) {
    fs.exists('data',function(exists){
        if(exists){
            fs.readdir('data',function(err,files){
                if(!err){
                    //console.log(files)

                    var count = []
                    //res.send(datas)
                    for(var i = 0 ; i < files.length; i++ ){
                        fs.readFile('data/' + files[i], function(err,data){

                            //if(!err){
                                console.log(JSON.parse(data))
                                //count[i] += JSON.parse(data)
                                //console.log(count)

                                //var count = JSON.parse(data)
                                //res.send(data)
                            //}

                        })

                    }
                }
            })
        }
    })
})




















//监听端口
app.listen(3000,function(){
    console.log('it is running')
})
