const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')

const postsRouter = require("./postsRouter")

const server = express().use(express.json(), helmet(), cors(), morgan('combined'))
server.use("/api/posts", postsRouter)

server.get("/", (req, res) => {
    res.status(200).json({message: "hello"})
})

module.exports = server