const fs = require('fs')
const path = require('path')
const http = require('http')
const urlLib = require('url')
const util = require('util')

const { ResponseError } = require('./models/ResponseError')
const { onServerError } = require('./handlers/error.handler')
const member = require('./handlers/member.handler')

const readFileAsync = util.promisify(fs.readFile)
const ROOT = process.cwd()


const HANDLERS = {
    'GET /': member.onDefaultRoute,
    'GET /members': member.onMemberListRoute,
    'GET /member-detail': member.onMemberDetailRoute,
}

const server = http.createServer()

server.on('request', (req, res) => {
    const method = req.method
    const url = urlLib.parse(req.url)
    const route = `${method} ${url.pathname}`
    
    console.log('Accessing route: ', route)
    const handler = HANDLERS[route]

    if (!handler) {
        res.writeHead(404)
        return res.end()
    }

    res.on('error', (err) => {
        console.error('Error occured on response:', err)
    })

    handler(req, res)
        .then(content => {
            res.writeHead(200, {
                'Content-Type': 'text/html',
            })
            return content
        })
        .catch(err => {
            console.error('Error occured on route:', err)
            if (err instanceof ResponseError) {
                return onServerError(err.message) // Intended message
            }
            return onServerError('Vui lòng liên hệ với admin để được hỗ trợ.')
        })
        // Write responded data
        .then(content => res.write(content))
        .catch(err => {
            console.error('Error occured on Error page:', err)
            res.writeHead(500)
        })
        .finally(() => {
            res.end()
        })
})

server.on('listening', () => {
    console.log('Server is listening at port 3000')
})

server.on('error', (err) => {
    console.error('Error occured on server:', err)
})

server.listen(3000)