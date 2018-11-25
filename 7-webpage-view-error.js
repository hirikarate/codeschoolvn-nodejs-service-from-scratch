const fs = require('fs')
const http = require('http')
const util = require('util')

const readFileAsync = util.promisify(fs.readFile)

class ServersideError extends Error {
}

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
    // 3. Throw a custom general error
    // throw new ServersideError('Custom general error')

    const rowStr = MEMBERS
        .map(mem => `
            <tr>
            <td>${mem.name}</td>
            <td>${mem.age}</td>
            </tr>
        `)
        .reduce((prev, cur) => prev + cur, '')

    return readFileAsync('views/member-list.html', 'utf8')
        .then(html => {
            // 2. Throw a custom Promise error
            // throw new ServersideError('Custom Promise error')

            const content = html.replace('{{rows}}', rowStr)
            return content
        })
}

const onError = function (err) {
    console.error('Route error:', err)
    return readFileAsync('views/error.html', 'utf8')
        .then(html => {
            const errMsg = (err instanceof ServersideError
                ? err.message
                : '')
            const content = html.replace('{{reason}}', errMsg)
            return content
        })
}

const requestListener = (req, res) => {
    const { method, url } = req
    const route = `${method} ${url}`
    const handler = HANDLERS[route]

    if (!handler) {
        res.writeHead(404)
        return res.end()
    }

    handler(req, res)
        .catch(onError)
        .then(content => {
            res.writeHead(200, {
                'Content-Type': 'text/html',
            })
            res.write(content)
        })
        .catch(err => {
            console.error('Error Page error:', err)
            res.writeHead(500)
        })
        .finally(() => {
            res.end()
        })
}

const HANDLERS = {
    'GET /': onDefaultRoute,
    'GET /members': onMemberListRoute,
}

// 1. Create a EADDRINUSE error
// http.createServer().listen(3000)

http.createServer()
    .on('request', requestListener)
    .on('listening', () => {
        console.log('Server is listening at port 3000')
    })
    .on('error', (err) => {
        console.error('Web Server error:', err)
    })
    .listen(3000)