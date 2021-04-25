const express = require('express')
const Router = express.Router()
const Category = require('./Category')
const Articles = require('../articles/Article')
const adminAuth = require('../middlewares/adminAuth')
const slugify = require('slugify')

//Admin Routers

Router.get('/admin/categories/new', adminAuth, (req, res) => {
    res.render('./admin/categories/new.ejs')
})
Router.get('/admin/categories', adminAuth, (req, res) => {
    Category.findAll({
        raw: true,
        order: [
            ['id', 'ASC']
        ]
    }).then((allCategories) => {
        res.render('./admin/categories/index.ejs', {
            categories: allCategories
        })
    })

})

Router.post('/admin/categories/save', adminAuth, (req, res) => {
    const title = req.body.title
    if (title != undefined) {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/')
        })
    } else {
        res.redirect('/admin/categories/new')
    }

})

Router.post('/admin/categories/delete', adminAuth, (req, res) => {
    const id = req.body.id
    if (id != undefined && id != isNaN) {
        Category.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/admin/categories')
        })
    } else {
        res.redirect('/admin/categories')
    }
})

Router.get('/admin/categories/update/:id', adminAuth, (req, res) => {
    const id = req.params.id
    if (id != undefined && id != isNaN) {
        Category.findOne({
            where: {
                id: id
            }
        }).then((result) => {
            if (result != undefined) {
                res.render('./admin/categories/update.ejs', {
                    category: result
                })
            } else {
                res.redirect('/admin/categories')
            }
        })
    } else {
        res.redirect('admin/categories')
    }
})

Router.post('/admin/categories/update', adminAuth, (req, res) => {
    const { id, title } = req.body
    if (id != undefined && id != isNaN && title != undefined) {
        Category.update({
            title: title,
            slug: slugify(title)
        }, {
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/admin/categories')
        }).catch((error) => {
            res.redirect(`/admin/categories/update/${id}`)
        })
    }
})

//Simple users routers

Router.get('/categories/:slug', (req, res) => {
    const slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        }
    }).then((category) => {
        if (category != undefined) {
            Articles.findAll({
                where: {
                    categoryId: category.id
                }
            }).then((result) => {
                Category.findAll().then((categories) => {
                    res.render('./category.ejs', {
                        articles: result,
                        categories: categories
                    })
                })
            }).catch((error) => {
                res.redirect('/')
            })
        } else {
            res.redirect('/')
        }

    })
})

module.exports = Router