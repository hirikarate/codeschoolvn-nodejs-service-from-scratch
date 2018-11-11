const fs = require('fs')
const path = require('path')
const util = require('util')

const readFileAsync = util.promisify(fs.readFile)

exports.onServerError = function (reason) {
    return readFileAsync(path.join(ROOT, 'views', 'error.html'), 'utf8')
        .then(tpl => {
            const content = tpl.replace('@error_reason@', reason)
            return content
        })
}
