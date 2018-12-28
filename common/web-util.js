const path = require('path')

const ROOT = process.cwd()


/**
 * Creates absolute path to public files.
 * @param {string} fileName (optional)
 */
function buildPublicPath(fileName = '') {
    return path.join(ROOT, 'public', fileName)
}

/**
 * Creates absolute path to view file.
 * @param {string} fileName (optional)
 */
function buildViewPath(fileName = '') {
    return path.join(ROOT, 'views', fileName)
}

module.exports = {
    buildPublicPath,
    buildViewPath,
}