const http = require('http')


const server = http.createServer()

server.on('request', (req, res) => {
    // res.end('<html><head></head><body></body></html>')

    // res.write('<html>')
    // res.write('<head>')
    // res.write('</head>')
    // res.write('<body>')
    // res.write('<h3>Hello</h3>')
    // res.write('<h1>CODESCHOOL.VN</h1>')
    // res.write('</body>')
    // res.write('</html >')
    // res.end()

    res.writeHead(200, {
        'Content-Type': 'text/html', // text/plain, application/octet-stream, application/xml
    })
    res.write(`
        <html>
            <head>
                <!--<meta charset="utf-8">-->
                <title>My first NodeJS web</title>
            </head>
            <body>
                <h2>Chào lớp học tại</h2>
                <h1>CODESCHOOL.VN</h1>
            </body>
        </html>`, 
        'latin1' // Encoding
        //'utf8' // 'utf-8
    )

    res.end(() => {
        console.log('Response stream ended')
    })
})

server.on('listening', () => {
    console.log('Server is listening at port 3000')
})

server.on('error', (err) => {
    console.error('Server error', err) // Example: EADDRINUSE
})

server.listen(3000)