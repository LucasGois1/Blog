const Sequelize = require('sequelize')

const connection = new Sequelize('articlescenter', 'lucasgoisdev', 'Arutiunian1', {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    host: 'mysql743.umbler.com',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connection