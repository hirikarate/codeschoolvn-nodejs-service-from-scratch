const http = require('http')


/*
 * Option 1
 */
// const requestListener = function(req, res) {
//     res.end('Hello CodeSchool')
// }
// const server = http.createServer(requestListener)

/*
 * Option 2
 */
// http
//     .createServer((req, res) => {
//         res.end('Hello CodeSchool')
//     })
//     .listen(3000, () => {
//         console.log('Server is listening at port 3000')
//     })

/*
 * Option 3
 */
const server = http.createServer()

server.on('request', (req, res) => {
    // console.dir(req, { depth: 1 })
    // nodejs.org => IncomingMessage => ReadableStream

    // console.dir(res, { depth: 1 })
    // nodejs.org => ServerResponse => WriteableStream

    // res.end('Hello CodeSchool')
    res.write('Hello CodeSchool')
    res.end()
})

/*
 * Option 1
 */
// server.listen(3000, () => {
//     console.log('Server is listening at port 3000')
// })

/*
 * Option 2
 */
server.on('listening', () => {
    console.log('Server is listening at port 3000')
})
server.listen(3000)