// 1.导入定义验证规则的模块
const joi = require("@hapi/joi");

// 2. 定义name和alias的验证规则
const name = joi.string().required();
const alias = joi.string().alphanum().required();

// id的校验规则
const id = joi.number().integer().min(1).required();

// 3. 向外共享验证规则对象
exports.add_cate_schema = {
    body: {
        name,
        alias
    }
}

// 验证规则对象 - 删除文章分类
exports.delete_cate_schema = {
    params: {
        id
    }
}

// 验证规则对象 - 根据id获取文章分类
exports.get_cate_schema = {
    params: {
        id
    }
}

// 验证规则对象 - 根据id更新文章分类
exports.update_cate_schema = {
    body: {
        Id: id,
        name,
        alias
    }
}