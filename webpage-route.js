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

const onDefaultRoute = function (req, res) {
    res.write(`
        <html>
            <head>
                <meta charset="utf-8">
                <title>My first NodeJS web</title>
            </head>
            <body>
                <h2>Chào lớp học tại</h2>
                <h1>CODESCHOOL.VN</h1>
                <a href="/members">Xem danh sách lớp</a>
            </body>
        </html>`,
        'utf8'
    )
}

const onMemberListRoute = function (req, res) {
    res.write(`
        <html>
            <head>
                <meta charset="utf-8">
                <title>NodeJS class members</title>
            </head>
            <body>
                <h2>Danh sách lớp NodeJS</h2>
                <table border="1" cellpadding="10" cellspacing="5">
    `)
    for (let mem of MEMBERS) {
        res.write(`
            <tr>
            <td>${mem.name}</td>
            <td>${mem.age}</td>
            </tr>
        `)
    }
    res.write(`
                </table>
                <a href="/">&lt;&lt; Trang chủ</a>
            </body>
        </html>
    `)
}

const HANDLERS = {
    'GET /': onDefaultRoute,
    'GET /members': onMemberListRoute,
}

const server = http.createServer()

server.on('request', (req, res) => {
    // const method = req.method
    // const url = req.url
    const { method, url } = req
    // let handler

    // if (method === 'GET' && url === '/') {
    //     handler = onDefaultRoute
    // }
    // else if (method === 'GET' && url === '/members') {
    //     handler = onMemberListRoute
    // }

    // if (!handler) {
    //     res.writeHead(404)
    //     return
        //// return res.writeHead(404)
    // }

    const route = `${method} ${url}`
    const handler = HANDLERS[route]

    if (!handler) {
        res.writeHead(404)
        return res.end()
    }
    else { // Remove else
        res.writeHead(200, {
            'Content-Type': 'text/html',
        })
        handler(req, res)
        res.end()
    }
})

server.on('listening', () => {
    console.log('Server is listening at port 3000')
})

server.on('error', (err) => {
    console.error(err)
})

server.listen(3000)