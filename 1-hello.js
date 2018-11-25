const http = require('http')

function optionOne() {
    const requestListener = function(req, res) {
        res.end('Hello CodeSchool')
    }
    const server = http.createServer(requestListener)

    const onListening = () => {
        console.log('Server is listening at port 3000')
    }
    server.listen(3000, onListening)
}


function optionTwo() {
    const server = http.createServer(function (req, res) {
        res.end('Hello CodeSchool')
    })

    server.listen(3000, () => {
        console.log('Server is listening at port 3000')
    })
}

optionOne()
// optionTwo()