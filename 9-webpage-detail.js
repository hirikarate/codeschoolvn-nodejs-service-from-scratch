const http = require('http')
const urlLib = require('url')

const { onServerError } = require('./handlers/error-handler')
const member = require('./handlers/member-handler')


/*
 * Event listeners
 */

const handleUnexpectedError = (err) => {
    console.error('Unhandled error:', err)
    process.exit()
}
process.on('uncaughtException', handleUnexpectedError)
process.on('unhandledRejection', handleUnexpectedError)


const HANDLERS = {
    'GET /': member.onDefaultRoute,
    'GET /members': member.onMemberListRoute,
    'GET /member-detail': member.onMemberDetailRoute,
}

const requestListener = async (req, res) => {
    const { method, url } = req
    const pathname = urlLib.parse(url).pathname
    const route = `${method} ${pathname}`
    console.log({ route })
    const handler = HANDLERS[route]

    if (!handler) {
        res.writeHead(404)
        return res.end()
    }

    res.on('error', handleUnexpectedError)

    let content = ''
    try {
        content = await handler(req)
    }
    catch (err) {
        content = await onServerError(err)
    }
    finally {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        })
        res.write(content)
        res.end()
    }
}


http.createServer()
    .on('request', requestListener)
    .on('listening', () => {
        console.log('Server is listening at port 3000')
    })
    .on('error', (err) => {
        console.error('Web Server error:', err)
    })
    .listen(3000)