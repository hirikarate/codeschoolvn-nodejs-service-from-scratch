
function generateFakeData() {
    const { HobbyMapper } = require('../../models/mappers/HobbyMapper')
    const mapper = new HobbyMapper()
    const from = mapper.sanitizeHobby
    return [
        from({
            id: 1,
            name: 'Đọc sách',
        }).data,
        from({
            id: 2,
            name: 'Bơi lội',
        }).data,
        from({
            id: 3,
            name: 'Đá bóng',
        }).data,
        from({
            id: 4,
            name: 'Du lịch',
        }).data,
        from({
            id: 5,
            name: 'Mua sắm',
        }).data,
    ]
}

exports.generateFakeData = generateFakeData
