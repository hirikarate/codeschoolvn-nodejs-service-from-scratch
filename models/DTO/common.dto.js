
class FindAllCommand {
    constructor(pageIndex, pageSize) {
        this.pageIndex = pageIndex
        this.pageSize = pageSize
    }
}
exports.FindAllCommand = FindAllCommand


class FindAllResult {
    constructor(items, totalCount) {
        this.items = items
        this.totalCount = totalCount
    }
}
exports.FindAllResult = FindAllResult


