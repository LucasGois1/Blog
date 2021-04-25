//External libs

const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const bcrypt = require('bcryptjs')

//DB connection and DB tables

const connection = require('./database/database')

const CategoriesController = require('./categories/CategoriesController')
const ArticlesController = require('./articles/ArticlesController')
const UsersController = require('./users/userController')

const Articles = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./users/User')


const app = express()


app.set('view engine', 'ejs')

connection
    .authenticate()
    .then(() => {
        console.log('Connection : SUCESS')
    }).catch((error) => {
        console.log(error)
    })

//Session settings

app.use(session({
    secret: 'sessionsecret',
    cookie: {
        maxAge: (5 * 60) * 1000
    }
}))


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))


//Connecting controllers 

app.use('/', CategoriesController)
app.use('/', ArticlesController)
app.use('/', UsersController)

// Routers

app.get('/', (req, res) => {
    Articles.findAll({
        limit: 4
    }).then((articles) => {
        Category.findAll().then((result) => {
            if (result != undefined) {
                res.render('./index.ejs', {
                    articles: articles,
                    categories: result
                })
            } else {
                res.redirect('/')
            }
        })
    })
})

app.get('/login', (req, res) => {
    res.render('./login/index.ejs')
})

app.post('/login/authenticate', (req, res) => {
    const { email, password } = req.body
    User.findOne({
        where: {
            email: email
        }
    }).then((user) => {
        if (user != undefined) {
            const correct = bcrypt.compareSync(password, user.password)
            if (correct) {
                req.session.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
                res.redirect('/admin/articles')
            } else {
                res.redirect('/login')
            }
        } else {
            res.redirect('/login')
        }
    })
})

//Listening port: 3000 ( Entry point )
app.listen(3000, () => {
    console.log('Server is running.')
})