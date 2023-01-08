const path = require('path')
const express = require('express')
const session = require(`express-session`)
const Store = require(`connect-session-knex`)(session)

const usersRouter = require('./users/users-router.js')
const authRouter = require(`./auth/authRouter`)

const server = express()

server.use(express.static(path.join(__dirname, '../client')))
server.use(express.json())
server.use(session({
  name: `cookieMonster`, //session id
  secret: `Keep it secret, bananas are key`,
  cookie: { //transport for session id to the server
    maxAge: 1000 * 60 * 60, //in milliseconds
    secure: false, 
    httpOnly: false, //can JS on the page read this?
  },
  rolling: true, //fresh cookie with every login
  resave: false, 
  saveUninitialized: false, //can't set cookies on any client that makes a request. Can ONLY set cookies for those users who have agreed (successful login)
  store: new Store({
    knex: require(`../database/db-config`),
    tablename: `sessions`, //default is this name (sessions)
    sidfieldname: `sid,`,
    createtable: true,
    clearInterval: 1000 * 60 * 60, //cleanup every so often to remove old sessions from the db
  })
}))

server.use(`/api/auth`, authRouter)
server.use('/api/users', usersRouter)

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'))
})

server.use('*', (req, res, next) => {
  next({ status: 404, message: 'not found!' })
})

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  })
})

module.exports = server
