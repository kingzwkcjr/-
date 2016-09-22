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
    destination:'wwwroot/uploads',
    filename:function(req,file,cb){
        var uname = req.cookies.username
        cb(null,uname + '.jpg')
    }
})
var uploads = multer({storage})

//解析cookie
app.use(cookieParser())
// ----------------------注册--------------------------
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


//-------------------登录---------------------------
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
    res.status(200).send('success')
})


//文件上传请求
app.post('/user/photo',uploads.single('photo'), function(req, res){
    res.status(200).json({code:'success', message:'上传成功,'})
})




//var datas
//setInterval(function(){
//    var data = new Date()
//    var y = data.getFullYear()
//    var m = data.getMonth() + 1
//    var d = data.getDate()
//    var h = data.getHours()
//    var ms = data.getMinutes()
//    var ss = data.getSeconds()
//    datas = y  + '-' + m  + '-'  + d  + '-'  + h  + '-'  + ms  + '-'  + ss
//},1000)







//问题留言

app.post('/ask',function(req,res){
    var petname = req.cookies.username
    console.log(req.body)
    //把当前提问的内容保存至某个文件中，文件名以当前时间取名，便于查询以及后期的回答
    //设置时间+ip
    var time = new Date()
    var time1 = (new Date()).toLocaleDateString() + ' ' + (new Date()).toLocaleTimeString()
    req.body.ip = req.ip
    req.body.time = time1
    req.body.petname = petname
    req.body.time2 = time

    //封装返回服务器信息的方法
    function send(code,message){
        res.status(200).json({code,message})
    }


    //封装保存文件的方法

    function saveFile(){
        //先设置文件名，设置文件名--以当前时间取名
        var fileName = 'questions/' + time.getTime() + '.txt'
        fs.appendFile(fileName, JSON.stringify(req.body),function(err){
            if(err){
                send('err','保存文件失败')
            }else{
                send('success','保存提交成功')
            }
        })
    }
    fs.exists('questions', function (ex) {
        if(!ex){
            fs.mkdirSync('questions')
            saveFile()

        }else{
            saveFile()
        }
    })


})
//------------------------------首页获取提问的内容信息-----------------------
app.get('/question', function (req, res) {
    function send(code,message,questions){
        //code读取是否成功，message：是否成功相对应的信息，questions:读到的文件的内容数据
        res.status(200).json({code,message,questions})
    }


    function reads(i, files , questions , cb){
        var filePath = 'questions/' + files[i]
        if(i <files.length){
            fs.readFile(filePath,function(err,data) {
                if (err) {
                    send('error', '获取数据失败')
                } else {
                    questions.push(JSON.parse(data))
                }
                reads(++i, files, questions, cb)
            })
        }else{
            cb()
        }
    }
    //判断文件夹是否存在
    fs.exists('questions',function(ex){
        if(!ex){
            send('err','文件系统错误','空')
        }else{
            //读取文件夹内部的所有文件的内容
            fs.readdir('questions',function(err,files){
                if(err){
                    send('error','文件系统错误')
                }else{
                    console.log(files)

                    var files = files
                    var questions = []
                    reads(0,files,questions,function(){
                        send('success','获取数据成功',questions)
                    })
                }
            })
        }
    })
})



//-------------------------------回答数据处理------------------------------------------

app.post('/answer',function(req,res){
    //回答的内容保存在哪，---问题的文件内，如何与回答的那个问题联系在一起

    //获取文件名称--通过浏览器端设定的cookie
    var fileName = 'questions/' + req.cookies.questions + '.txt'
    var aname = req.cookies.username
    req.body.ip = req.ip
    req.body.time = new Date()
    req.body.petname = aname
    //fs.appendFile(fileName,','+ JSON.stringify(req.body),function(err){
    //    if(err){
    //        res.send('保存失败')
    //    }else{
    //        res.send('保存成功')
    //    }
    //})

    fs.readFile(fileName, function (err, data) {
        if(err){
            res.send('保存失败')
        }else{
            var datas = JSON.parse(data)
            //datas : {}

            //console.log(datas)
            if(!datas.answers){
                datas.answers = []
            }


            datas.answers.push(req.body)
            fs.writeFile(fileName,JSON.stringify(datas), function (err) {
                if(err){
                    res.send('保存数据失败')
                }else{
                    res.send('保存数据成功')
                }
            })
        }
    })




})















//监听端口
app.listen(2000,function(){
    console.log('it is running')
})
