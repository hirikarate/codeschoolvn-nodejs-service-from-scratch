const fs = require('fs')
const http = require('http')
const util = require('util')

const readFileAsync = util.promisify(fs.readFile)

class ServersideError extends Error {
}

/*
 * Constants
 */

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


/*
 * Event listeners
 */

const handleUnexpectedError = function (err) {
    console.error('Unhandled error:', err)
    process.exit()
}
process.on('uncaughtException', handleUnexpectedError)
process.on('unhandledRejection', handleUnexpectedError)

const requestListener = async (req, res) => {
    const { method, url } = req
    const route = `${method} ${url}`
    const handler = HANDLERS[route]

    if (!handler) {
        res.writeHead(404)
        return res.end()
    }

    res.on('error', handleUnexpectedError)

    let content = ''
    try {
        content = await handler(req, res)
    }
    catch(err) {
        content = await onError(err)
    }
    finally {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        })
        // 6. Cause response error
        // res.end()
        res.write(content)
        res.end()
    }
}


/*
 * Route handlers
 */

const onDefaultRoute = function (req) {
    return readFileAsync('views/default-mat.html', 'utf8')
}

const onMemberListRoute = async function (req) {
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


    // 4. Cause Node general error
    // const html = await readFileAsync('views/member-list', 'utf8')
    const html = await readFileAsync('views/member-list-mat.html', 'utf8')
    // 2. Throw a custom Promise error
    // .then(() => {
    //     throw new ServersideError('Custom Promise error')
    // })
    const content = html.replace('{{rows}}', rowStr)
    return content
}

const onError = async function (err) {
    // 5. Throw an unexpected error (must enable error [4])
    // throw new Error('An error noone expects')

    console.error('Route error:', err)
    const html = await readFileAsync('views/error-mat.html', 'utf8')
    const errMsg = (err instanceof ServersideError
        ? err.message
        : 'Vui lòng liên hệ với admin để được hỗ trợ')
    const content = html.replace('{{reason}}', errMsg)
    return content
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