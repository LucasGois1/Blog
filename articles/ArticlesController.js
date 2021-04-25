const express = require('express')
const Category = require('../categories/Category')
const Article = require('./Article')
const adminAuth = require('../middlewares/adminAuth')
const slugify = require('slugify')
const Router = express.Router()

//Admin Routers

Router.get('/admin/articles', adminAuth, (req, res) => {
    Article.findAll({
        include: [{ model: Category }]
    }).then((articles) => {
        res.render('./admin/articles/index.ejs', {
            articles: articles
        })
    })
})

Router.get('/admin/articles/new', adminAuth, (req, res) => {
    Category.findAll({
        order: [
            ['title', 'ASC']
        ]
    }).then((categories) => {
        res.render('./admin/articles/new.ejs', {
            categories: categories
        })
    })

})

Router.post('/admin/articles/save', adminAuth, (req, res) => {
    const { title, body, categoryId } = req.body
    if (title, body, categoryId) {
        Article.create({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: categoryId
        }).then(() => {
            res.redirect('/admin/articles')
        })
    } else {
        res.redirect('/admin/articles/new')
    }
})

Router.post('/admin/articles/delete', adminAuth, (req, res) => {
    const id = req.body.id
    if (id != undefined && id != isNaN) {
        Article.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/admin/articles')
        })
    } else {
        res.redirect('/admin/articles')
    }
})

Router.get('/admin/articles/update/:id', adminAuth, (req, res) => {
    const id = req.params.id
    Article.findOne({
        include: [{ model: Category }],
        where: {
            id: id
        }
    }).then((result) => {
        if (result != undefined) {
            Category.findAll().then((categories) => {
                res.render('./admin/articles/update', {
                    article: result,
                    categories: categories
                })
            })
        } else {
            res.redirect('/admin/articles')
        }
    })
})

Router.post('/admin/articles/update', adminAuth, (req, res) => {
    const { id, title, body, categoryId } = req.body
    Article.update({
        title: title,
        body: body,
        categoryId: categoryId,
        slug: slugify(title)
    }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/articles')
    }).catch((error) => {
        res.redirect(`/admin/articles/update/${id}`)
    })
})

//Simple users Routers

Router.get('/articles/:slug', (req, res) => {
    const slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then((result) => {
        if (result != undefined) {
            Category.findAll().then((categories) => {
                res.render('./article.ejs', {
                    article: result,
                    categories: categories
                })
            })
        } else {
            res.redirect('/')
        }
    })
})

Router.get('/articles/page/:number', (req, res) => {
    const number = parseInt(req.params.number)
    let offset = 0

    if (number == 0 || number == 1) {
        offset = 0
    } else {
        offset = (number - 1) * 4
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset
    }).then((result) => {
        if (result.rows.length == 0) {
            res.redirect('/')
        } else {
            Category.findAll().then((categories) => {
                res.render('./page.ejs', {
                    articles: result.rows,
                    categories: categories,
                    page: number
                })
            })
        }

    })
})

module.exports = Router