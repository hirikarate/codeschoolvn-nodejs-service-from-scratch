const fs = require('fs')
const path = require('path')
const util = require('util')

const { buildPublicPath, buildResponse } = require('../common/web-util')

const readFileAsync = util.promisify(fs.readFile)

const MEMETYPES = new Map()
MEMETYPES.set('.jpg', 'image/jpeg')
MEMETYPES.set('.jpeg', 'image/jpeg')
MEMETYPES.set('.gif', 'image/gif')
MEMETYPES.set('.png', 'image/png')
MEMETYPES.set('.mp3', 'audio/mp3')
MEMETYPES.set('.mp4', 'video/mp4')

const sanitizePath = function(url) {
    const destUrl = url.replace(/^\/static/, '') // Destination URL
    const normalPath = path.normalize(destUrl)
    const safePath = normalPath.replace(/^(\.\.[\/\\])+/, '')
    return {
        fileExt: path.extname(safePath),
        filePath: buildPublicPath(safePath),
    }
}

const cache = new Map()
exports.onCacheableRoute = async function (req) {
    const { fileExt, filePath } = sanitizePath(req.url)

    if (!MEMETYPES.has(fileExt)) {
        return buildResponse('File type not supported', 400)
    }
    const headers = {
        'Content-Type': MEMETYPES.get(fileExt)
    }

    // Check the cache first...
    if (cache.has(filePath)) {
        return buildResponse(cache.get(filePath), 200, headers)
    }

    // ...otherwise load the file
    try {
        const data = await readFileAsync(filePath)
        cache.set(filePath, data)
        return buildResponse(data, 200, headers)
    }
    catch (err) {
        console.error(err)
        return buildResponse(null, 404)
    }
}

exports.onAsyncRoute = function (req) {
    const { fileExt, filePath } = sanitizePath(req.url)

    if (!MEMETYPES.has(fileExt)) {
        return Promise.resolve(buildResponse('File type not supported', 400))
    }
    const headers = {
        'Content-Type': MEMETYPES.get(fileExt)
    }

    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(err)
                return resolve(buildResponse(null, 404))
            }
            resolve(buildResponse(data, 200, headers))
        })
    })
}

exports.onSyncRoute = function (req) {
    const { fileExt, filePath } = sanitizePath(req.url)

    if (!MEMETYPES.has(fileExt)) {
        return buildResponse('File type not supported', 400)
    }
    const headers = {
        'Content-Type': MEMETYPES.get(fileExt)
    }

    try {
        const data = fs.readFileSync(filePath)
        cache.set(filePath, data)
        return buildResponse(data, 200, headers)
    }
    catch (err) {
        console.error(err)
        return buildResponse(null, 404)
    }
}
