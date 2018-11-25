const http = require('http')
const { Stream } = require('stream');
const urlLib = require('url')

const { chooseHandler } = require('./common/web-util')
const { onServerError } = require('./handlers/error-handler-save')
const member = require('./handlers/member-handler-validation')
const static = require('./handlers/static-handler')


/*
 * Event listeners
 */

const handleUnexpectedError = (err) => {
    console.error('Unhandled error:', err)
    process.exit()
}
process.on('uncaughtException', handleUnexpectedError)
process.on('unhandledRejection', handleUnexpectedError)


const HANDLERS = new Map()
HANDLERS.set(/^GET \/$/, member.onDefaultRoute)
HANDLERS.set(/^GET \/members$/, member.onMemberListRoute)
HANDLERS.set(/^GET \/member-detail$/, member.onMemberDetailRoute)
HANDLERS.set(/^POST \/member-detail$/, member.onMemberSaveRoute)
HANDLERS.set(/^GET \/static\/[-\w\.]*/, static.onAsyncRoute)
// HANDLERS.set(/^GET \/static\/[-\w\.]*/, static.onSyncRoute)
// HANDLERS.set(/^GET \/static\/[-\w\.]*/, static.onCacheableRoute)

/**
 * Handles every request to web server
 * @param {http.IncommingMessage} req The request object
 * @param {http.ServerResponse} res The response object
 */
const requestListener = async (req, res) => {
    const handler = chooseHandler(HANDLERS, req.method, req.url)

    if (!handler) {
        res.writeHead(404)
        return res.end()
    }

    res.on('error', handleUnexpectedError)

    let response = ''
    try {
        response = await handler(req)
    }
    catch (err) {
        response = await onServerError(err)
    }
    finally {
        const headers = Object.assign(
            { 'Content-Type': 'text/html' },
            response.headers
        )

        res.writeHead(response.status, headers)

        const { content } = response
        if (content instanceof Stream) {
            res.pipe(content)
        } else {
            res.end(content)
        }
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