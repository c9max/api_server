// 导入数据库操作模块
const db = require('../db/index');
// 导入 bcrypt.js 这个包 (用来加密密码的)
const bcrypt = require("bcryptjs");
// 导入生成Token的包
const jwt = require("jsonwebtoken");
// 导入全局的配置文件
const config = require("../config");

// 注册新用户的处理函数
exports.regUser = (req, res) => {
    // 1. 检测表单数据是否合法
    // 获取客户端提交到服务器的用户信息
    const userinfo = req.body;
    // 对表单中的数据，进行合法性的校验
    // if (!userinfo.username || !userinfo.password) {
    //     return res.send({ status: 1, message: '用户名或密码不合法' });
    // }
    // 2. 检测用户名是否被占用
    // 定义SQL语句
    const sqlStr = 'select * from ev_users where username = ?';
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 执行sql语句失败
        if (err) {
            // return res.send({ status: 1, message: err.message });
            return res.cc(err);
        }
        // 判断用户名是否被占用
        if (results.length > 0) { // 判断是否有数组对象
            // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名' });
            return res.cc('用户名被占用，请更换其他用户名');
        }
        // 3. 对密码进行加密处理
        // 调用 bcrypt.hashSync(明文密码, 随机盐的长度) 对密码进行加密
        // 随机盐的长度一般为10
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);
        // 4. 插入新用户
        // 定义插入新用户的SQL语句
        const sql = 'insert into ev_users set ?';
        // 调用 db.query() 执行SQL语句
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            // 判断SQL语句是否执行成功
            if (err) return res.cc(err);
            // 判断影响行数是否为1
            if (results.affectedRows !== 1) return res.cc("注册用户失败，请稍后再试！");
            // 注册用户成功
            // res.send({ status: 0, message: '注册成功！' });
            res.cc('注册成功！', 0);
        })
    });
}

// 登录的处理函数
exports.login = (req, res) => {
    // 接收表单数据
    const userinfo = req.body;
    // 定义SQL语句
    const sql = `select * from ev_users where username=?`;
    // 执行SQL语句，根据用户名查询用户的信息
    db.query(sql, userinfo.username, (err, results) => {
        // 执行SQL语句失败
        if (err) return res.cc(err);
        // 执行SQL语句成功，但是获取到的数据条数不等于1
        if (results.length !== 1) return res.cc("登录失败!");
        // 判断密码是否正确
        // 调用bcrypt.compareSync(用户提交的密码, 数据库中的密码)方法比较密码是否一致
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password);
        if (!compareResult) return res.cc("登录失败!");

        // 在服务器端生成Token字符串
        const user = {...results[0], password: '', user_pic: '' };
        // 对用户的信息进行加密，生成Token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretkey, { expiresIn: config.expiresIn });
        // 调用res.send()将token响应给客户端
        res.send({
            status: 0,
            message: "登录成功",
            // 为了方便客户端使用token，在服务器端直接拼接上Bearer的前缀
            token: "Bearer " + tokenStr
        })
    })
}