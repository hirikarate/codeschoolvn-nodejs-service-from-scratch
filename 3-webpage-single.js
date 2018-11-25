const http = require('http')

http
    .createServer()
    .on('request', (req, res) => {
        // OPT 1: res.end('<html><head></head><body><h1>Hello CodeSchool</h1</body></html>')

        // OPT 2:
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
            'Content-Type': 'text/html',
                        // text/plain
                        // application/xml
                        // application/octet-stream
        })

        res.write(`
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>My first NodeJS web</title>
                </head>
                <body>
                    <h2>Chào lớp học tại</h2>
                    <h1>CODESCHOOL.VN</h1>
                </body>
            </html>`,
            'utf8')

        res.end(() => {
            console.log('Response stream ended')
        })
    })
    .on('listening', () => {
        console.log('Server is listening at port 3000')
    })
    .on('error', (err) => {
        console.error('Server error', err) // Example: EADDRINUSE
    })
    .listen(3000)


