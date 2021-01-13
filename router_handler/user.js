// 导入数据库操作模块
const db = require('../db/index');
// 导入 bcrypt.js 这个包 (用来加密密码的)
const bcrypt = require("bcryptjs");

// 注册新用户的处理函数
exports.regUser = (req, res) => {
    // 1. 检测表单数据是否合法
    // 获取客户端提交到服务器的用户信息
    const userinfo = req.body;
    // 对表单中的数据，进行合法性的校验
    if (!userinfo.username || !userinfo.password) {
        return res.send({ status: 1, message: '用户名或密码不合法' });
    }
    // 2. 检测用户名是否被占用
    // 定义SQL语句
    const sqlStr = 'select * from ev_users where username = ?';
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 执行sql语句失败
        if (err) {
            return res.send({ status: 1, message: err.message });
        }
        // 判断用户名是否被占用
        if (results.length > 0) { // 判断是否有数组对象
            return res.send({ status: 1, message: '用户名被占用，请更换其他用户名' });
        }
    });
    console.log(userinfo);
    // 3. 对密码进行加密处理
    // 调用 bcrypt.hashSync(明文密码, 随机盐的长度) 对密码进行加密
    // 随机盐的长度一般为10
    userinfo.password = bcrypt.hashSync(userinfo.password, 10);
    console.log(userinfo);
}

// 登录的处理函数
exports.login = (req, res) => {
    res.send("login OK");
}