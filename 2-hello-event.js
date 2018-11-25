const http = require('http')

/*
 * EVENT-DRIVEN STYLE (Hướng sự kiện)
 */

function optionOne() {
    const server = http.createServer()

    server.on('request', (req, res) => {
        res.end('Hello CodeSchool')
    })

    server.on('listening', () => {
        console.log('Server is listening at port 3000')
    })

    server.listen(3000)
}


/**
 * Call-chaining (gọi liền tù tì)
 */
function optionTwo() {
    http.createServer()
        .on('request', (req, res) => {
            res.end('Hello CodeSchool')
        })
        .on('listening', () => {
            console.log('Server is listening at port 3000')
        })
        .listen(3000)
}

// optionOne()
optionTwo()
