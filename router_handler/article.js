// 文章的处理函数模块

const path = require("path");
const db = require("../db/index");

// 发布文章的处理函数
exports.addArticle = (req, res) => {
    // 将文件类型的数据，解析并挂载到 req.file 属性中
    // 将文本类型的数据，解析并挂载到 req.body 属性中
    // console.log(req.body);
    // console.log("------------");
    // console.log(req.file);
    if (!req.file || req.file.fieldname !== 'cover_img') {
        res.cc("文章封面是必选参数!");
    }
    // TODO: 证明数据都是合法的，可以进行后续业务逻辑的处理
    // 处理文章的信息对象
    const articleInfo = {
        // 标题、内容、发布状态、所属分类的id
        ...req.body,
        // 文章封面的存放路径
        cover_img: path.join("/uploads", req.file.filename),
        // 文章的发布时间
        pub_date: new Date(),
        // 文章作者的Id
        // 这是一个有权限的接口，调用该接口，就能从token中解析用户信息挂载到req.user这个属性中
        author_id: req.user.id
    }
    const sql = `insert into ev_articles set ?`;
    db.query(sql, articleInfo, (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc("文章发布失败");
        res.cc("发布文章成功", 0);
    })
}