var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sqlMap');
var formidable = require('formidable');
var path = require('path');
const fs = require('fs');

//连接数据库
var conn = mysql.createConnection(models.mysql);
conn.connect();

var jsonWrite = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.send('err')
    } else {
        res.send('ok')
    }
};

//增加用户接口
router.post('/addUser', (req, res) => {
    var sql_name = $sql.user.select_name
    var sql = $sql.user.add;
    var params = req.body;
    console.log("user post:" + params);
    conn.query(sql_name, params.username, function (err, result) {
        if (err) {
            console.log(err)
        }
        if (result[0] === undefined) {
            conn.query(sql, [params.username, params.password], function (err, result) {
                if (err) {
                    console.log(err)
                }
                if (result) {
                    res.send('ok')
                   // jsonWrite(res, result)
                }
            })
        } else {
            res.send('-1')    //当前注册name与数据库重复时，data返回-1
        }
    })
});

//查找用户接口
router.post('/selectUser', (req, res) => {
    var sql_name = $sql.user.select_name;
    var sql_password = $sql.user.select_password;
    var params = req.body;
    conn.query(sql_name, params.username, function (err, result) {
        if (err) {
            console.log(err)
        }
        if (result[0] === undefined) {
            res.send('-1')    //查询不出username，data返回-1

        } else {
            conn.query(sql_password, params.password, function (err, result) {
                if (err) {
                    console.log(err)
                }
                if (result[0] === undefined) {
                    res.send('0');    //userName正确后，password错误，data返回 0
                } else {
                    console.log(result[0]);
                    res.send('ok');
                    // jsonWrite(res, result);
                }
            })
        }
    })
});

//修改用户密码
router.post('/updatePwd', (req, res) => {
    var sql_name = $sql.user.select_name;
    var sql_updatePwd = $sql.user.update_user;
    var params = req.body;

    conn.query(sql_name, params.username, function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result[0] === undefined) {
            res.send('-1') //查询用户失败

        }
        else {
            conn.query(sql_updatePwd, [{ password: params.newPassword }, params.username], function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    res.send('修改成功');

                } else {
                    res.send('修改失败');
                }
            })
        }
    })



})


// 编辑用户信息
router.post('/editUserMsg', (req, res) => {
    var sql_name = $sql.user.select_name;
    var sql_updatePwd = $sql.user.update_user;
    var params = req.body;

    conn.query(sql_name, params.username, function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result[0] === undefined) {
            res.send('-1') //查询用户失败

        }
        else {
            conn.query(sql_updatePwd, [{ nickname: params.nickname, usersign: params.usersign, introduction: params.introduction }, params.username], function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    res.send('ok');

                } else {
                    console.log('err');
                }
            })
        }
    })
})


//获取用户信息
router.get('/getUserMsg', (req, res) => {
    var sql_name = $sql.user.select_name;
    var url = require('url');
    var p = url.parse(req.url, true);
    var params = p.query;

    conn.query(sql_name, params.username, function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result.length == 0) {
            console.log('err');
        }
        else if (result[0] === undefined) {
            res.send('-1')    //查询不出username，data返回-1
        } else {
            res.send(result[0]);
            //jsonWrite(res, result);
        }
    })

});

//添加好友
router.post('/addFriend',(req,res)=>{
    var sql_name=$sql.user.select_name;
    var sql_fname=$sql.friends.select_fname;
    var sql_add=$sql.friends.add;
    var params=req.body;
    var username=params.fname;

    conn.query(sql_name,username,function(err,result){
        if(err){
            console.log(err);
        }
        if(result[0]===undefined){
            res.send('-1');     // 不存在用户
        }
        else{
            conn.query(sql_fname,params.fname,function(err,result){
                if(err){
                    console.log(err)
                }
                if(result[0] === undefined){
                    conn.query(sql_add,[params.fname,params.uname],function(err,result){
                        if(err){
                            console.log(err);
                        }
                        if(result){
                            jsonWrite(res,result);
                        }else{
                            console.log(err);
                        }
                    })
                } else{
                    res.send('-2');
                }
            })


           
        }
    })
});

//获取好友
router.get('/getFriend',(req,res)=>{
    var sql_name=$sql.friends.select_uname;
    var url = require('url');
    var p = url.parse(req.url, true);
    var params = p.query;

    conn.query(sql_name,params.uname,function(err,result){
        if(err){
            console.log(err);
        }
        if(result.length==0){
            console.log(err);
        }
        if(result[0]===undefined){
            res.send(-1);   //查询好友失败
        }else{
            res.send(result)
        }
    })
})























//图片上传
router.post('/uploadImg', (req, res) => {
    var sql_name = $sql.user.select_name;
    var sql_upload = $sql.user.update_user;

    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../../../static/');
    //头像大小限制2m
    form.maxFieldsSize = 2 * 1024 * 1024;
    //使用文件的原扩展名
    form.keepExtensions = true;
    form.parse(req, function (err, username, file) {
        var filePath = "";

        var username = username.username;
        console.log(username)
        //原文件名
        // console.log(file.imgFile.name)
        if (file.imgFile) {

            filePath = file.imgFile.path;

        } else {
            for (var key in file) {
                if (file[key].path && filePath === '') {
                    filePath = file[key].path;
                    break;
                }
            }
        }
        //文件移动的目录文件夹，不存在时创建目标文件夹  
        var targetDir = path.join(__dirname, '../../../static/uploads');
        if (!fs.existsSync(targetDir)) {
            fs.mkdir(targetDir);
        }
        var fileExts = filePath.substring(filePath.lastIndexOf('.'));
        //验证图片类型
        if (('.jpg.jpeg.png.gif').indexOf(fileExts.toLowerCase()) === -1) {
            res.send('-2')  //格式不正确返回码 -2
        } else {
            var fileName = new Date().getTime() + fileExts;
            var targetFile = path.join(targetDir, fileName);

            //移动上传文件
            fs.rename(filePath, targetFile, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    conn.query(sql_name, username, function (err, result) {
                        if (err) {
                            console.log(err)
                        }
                        if (result[0] === undefined) {
                            res.send('-1');
                        }
                        else {
                            var fileUrl = '/../static/uploads/' + fileName;
                            conn.query(sql_upload, [{ avater: fileUrl }, username], function (err, result) {
                                if (err) {
                                    console.log(err);
                                }
                                if (result) {
                                    console.log('ok');
                                    res.send(fileUrl);

                                } else {
                                    console.log('err');
                                }
                            })
                        }
                    })

                }
            })
        }
    })
})





module.exports = router;