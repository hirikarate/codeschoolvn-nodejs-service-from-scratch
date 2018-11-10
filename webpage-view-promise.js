const fs = require('fs')
const http = require('http')
const util = require('util')

const readFileAsync = util.promisify(fs.readFile)


const MEMBERS = [
    { name: 'Hoàng Anh', age: 18 },
    { name: 'Tấn Đạt', age: 18 },
    { name: 'Minh Mẫn', age: 18 },
    { name: 'Bảo Nam', age: 18 },
    { name: 'Trung Nhân', age: 18 },
    { name: 'Quốc Trung', age: 18 },
    { name: 'Nguyễn Tú', age: 18 },
    { name: 'Phạm Tú', age: 18 },
]

const onDefaultRoute = function (req) {
    return readFileAsync('views/default.html', 'utf8')
}

const onMemberListRoute = function (req) {
    const rowStr = MEMBERS
        .map(mem => `
            <tr>
            <td>${mem.name}</td>
            <td>${mem.age}</td>
            </tr>
        `)
        .reduce((prev, cur) => prev + cur, '')

    return readFileAsync('views/member-list.html', 'utf8')
        .then(tpl => {
            const content = tpl.replace('@rows@', rowStr)
            return content
        })
}

const onError = function () {
    return readFileAsync('views/error.html', 'utf8')
}

const HANDLERS = {
    'GET /': onDefaultRoute,
    'GET /members': onMemberListRoute,
}

const server = http.createServer()

server.on('request', (req, res) => {
    const { method, url } = req
    const route = `${method} ${url}`
    const handler = HANDLERS[route]

    if (!handler) {
        res.writeHead(404)
        return res.end()
    }

    res.on('error', (err) => {
        console.error('Error occured on response:', err)
    })

    // handler(req, res)
    //     .then(content => {
    //         res.writeHead(200, {
    //             'Content-Type': 'text/html',
    //         })
    //         res.write(content)
    //     })
    //     .catch(err => {
    //         console.error('Error occured on route:', err)
    //         res.writeHead(500)
    //     })
    //     .finally(() => {
    //         res.end()
    //     })

    handler(req, res)
        .then(content => {
            res.writeHead(200, {
                'Content-Type': 'text/html',
            })
            return content
        })
        .catch(err => {
            console.error('Error occured on route:', err)
            return onError()
        })
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