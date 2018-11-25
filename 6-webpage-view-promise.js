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
        .then(html => {
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


const HANDLERS = {
    'GET /': onDefaultRoute,
    'GET /members': onMemberListRoute,
}

http.createServer()
    .on('request', (req, res) => {
        const { method, url } = req
        const route = `${method} ${url}`
        const handler = HANDLERS[route]

        if (!handler) {
            res.writeHead(404)
            return res.end()
        }

        // handler(req, res)
        //     .then(content => {
        //         res.writeHead(200, {
        //             'Content-Type': 'text/html',
        //         })
        //         res.write(content)
        //     })
        //     .catch(err => {
        //         console.error('Route error:', err)
        //         res.writeHead(500)
        //     })
        //     .finally(() => {
        //         res.end()
        //     })

        handler(req, res)
            // .then(content => {
            //     return content
            // })

            // .catch(err => {
            //     return onError(err)
            // })
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
    })
    .on('listening', () => {
        console.log('Server is listening at port 3000')
    })
    .on('error', (err) => {
        console.error('Server error:', err)
    })
    .listen(3000)