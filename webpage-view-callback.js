const fs = require('fs')
const http = require('http')


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

const onDefaultRoute = function (req, res, done) {
    fs.readFile('views/default.html', 'utf8', (err, template) => {
        if (err) {
            console.error(err)
            res.writeHead(500)
            return done()
        }
        res.write(template)
        done()
    })
}

const onMemberListRoute = function (req, res, done) {
    // let rowStr = ''
    // for (let mem of MEMBERS) {
    //     rowStr += `
    //         <tr>
    //         <td>${mem.name}</td>
    //         <td>${mem.age}</td>
    //         </tr>
    //     `
    // }
    const rowStr = MEMBERS
        .map(mem => `
            <tr>
            <td>${mem.name}</td>
            <td>${mem.age}</td>
            </tr>
        `)
        .reduce((prev, cur) => prev + cur, '')

    fs.readFile('views/member-list.html', 'utf8', (err, tpl) => {
        if (err) {
            console.error(err)
            res.writeHead(500)
            return done()
        }
        const content = tpl.replace('@rows@', rowStr)
        res.write(content)
        done()
    })
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

    // res.on('error', (err) => {
    //     console.error('Error occured on response:', err)
    // })

    res.writeHead(200, {
        'Content-Type': 'text/html',
    })
    // handler(req, res) // without callback, handle 'error' event
    handler(req, res, () => {
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