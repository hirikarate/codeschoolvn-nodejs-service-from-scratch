
exports.ResponseError = class extends Error {
    constructor(message = '') {
        super(message)
    }
}