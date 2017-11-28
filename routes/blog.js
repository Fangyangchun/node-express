var express = require("express"); 
var Blog = require('../models/blog');

var router = express.Router();

// 显示所有博客
router.get('/', function(req, res) {
    // 根据分类查找
    var {category} = req.query;
    var whereObj = {};
    if (category) {
        var reg = new RegExp('^' + category + '$');
        whereObj = {category: reg}
    }

    Blog.find(whereObj, function(err, blogs) {
        res.json({
            success: true,
            data: blogs
        })
    })
})

// 发布博客
router.post('/', function(req, res) {
    // 解构赋值
    var {title, body, author, tags, hidden, category} = req.body;
    console.log(title);
    if (title.length < 3) {
        res.length({success: false, message: '标题长度不能小于3'})
    }

    // 标签格式应该是对象数组

    // 把标签分割成数组格式
    var tagsArray = tags.split(',');
    // 新建一个空数组，用来放对象
    var tagsObjArray = [];
    // 通过遍历的方式，把标签内容放入对象里面，通过push方式
    tagsArray.forEach(function(v) {
        tagsObjArray.push({title:v});
    })

    var blog = new Blog({
        title,
        body,
        author,
        tags: tagsObjArray,
        hidden,
        category
    });
    blog.save(function(err) {
        if (err) {
            res.json({success: false, message:'博客发布失败!'})
        }
        res.json({success: true, message: '博客发布成功!'})
    })
})

// 修改博客
router.put('/', function(req, res) {
    var {title, newTitle, body, newBody, author, newAuthor} = req.body;
    if (newTitle.length < 3) {
        res.json({
            success: false,
            message: '标题长度不能小于3'
        })
    }
    Blog.update({
        title: title,
        body: body,
        author: author
    }, {
        title: newTitle,
        body: newBody,
        author: newAuthor
    }, function(err, blog) {
        if (err) {
            res.json({success: false, message: '更新博客失败'})
        }
    })
    res.json({success: true, message: '更新博客成功'})
})

// 删除博客
router.delete('/', function(req, res) {

    // 解构赋值
    var {title} = req.body;
    Blog.remove({title: title}, function(err) {
        if (err) {
            res.json({success: false, message: '删除博客失败!'})
        }
    })
    res.json({message: true, mesage: '删除博客成功!'})
})

module.exports = router;
