// 数据库操作
var sqlMap = {
    user: {
        add: 'insert into user(username,password) values(?,?)',
        select_name: 'select * from user where username=?',
        select_password: 'SELECT * from user where password=?',
        update_user: 'update user set ? where username=?'   //更新用户信息

    },
    friends:{
        add:'insert into friends(fname,uname) values(?,?)',
        select_fname:'select * from friends where fname=?',
        select_uname:'select * from friends where uname=?', 
    }
}

module.exports = sqlMap;