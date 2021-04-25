const express = require('express')
const adminAuth = require('../middlewares/adminAuth')
const bcrypt = require('bcryptjs')
const Router = express.Router()
const User = require('./User')

//Admin Routers

Router.get('/admin/users', adminAuth, (req, res) => {
    User.findAll()
        .then((users) => {
            res.render('./admin/users/index.ejs', {
                users: users
            })
        })
})

Router.get('/admin/users/new', adminAuth, (req, res) => {
    res.render('./admin/users/new')
})

Router.post('/admin/users/save', adminAuth, (req, res) => {

    const { name, email, password } = req.body

    User.findOne({
        where: {
            email: email
        }
    }).then((user) => {
        if (user == undefined) {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)

            User.create({
                    name: name,
                    email: email.toLowerCase(),
                    password: hash
                })
                .then(() => {
                    res.redirect('/admin/users')
                })
                .catch((error) => {
                    res.redirect('/admin/users/new')
                })
        } else {
            res.redirect('/admin/users/new')
        }
    })
})

module.exports = Router