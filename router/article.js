// 这是文章的路由模块

const express = require("express");
const router = express.Router();

// 导入需要的处理函数模块
const article_handler = require("../router_handler/article");

// 导入multer和path
const multer = require("multer");
const path = require("path");

// 创建multer的实例
const uploads = multer({ dest: path.join(__dirname, "../uploads") })

// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
// 导入需要的验证规则对象
const { add_article_schema } = require("../schema/article");


// 发布文章的路由
// upload.single(文件名称) 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 注意: 文件名称是自己命名的，但是最好与解析出来的表单数据属性的文件名称保持一致
// 注意:在当前的路由中使用两个局部中间件;先使用 multer 解析表单数据，再使用 expressJoi 对表单数据进行验证
router.post("/add", uploads.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle);

module.exports = router;