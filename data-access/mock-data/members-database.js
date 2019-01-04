const Faculty = require('../../models/Faculty.enum')

function generateFakeData() {
    const { MemberMapper } = require('../../models/mappers/MemberMapper')
    const mapper = new MemberMapper()
    const from = mapper.sanitizeMember
    return [
        from({
            id: 1,
            name: 'Hoàng Anh',
            age: 25,
            address: 'Trần Hưng Đạo, Q.1,\nViệt Nam',
            isGraduated: false,
            faculty: Faculty.IT.key,
            hobbyIDs: [1, 3]
        }).data,
        from({
            id: 2,
            name: 'Tấn Đạt',
            age: 22,
            address: 'Q.2',
            isGraduated: true,
            faculty: null,
            hobbyIDs: [2, 4]
        }).data,
        from({
            id: 3,
            name: 'Minh Mẫn',
            age: 28, address: 'Q.3',
            isGraduated: true,
            faculty: Faculty.SALES.key,
            hobbyIDs: [1, 3, 5]
        }).data,
        from({
            id: 4,
            name: 'Bảo Nam',
            age: 21,
            address: 'Q.4',
            isGraduated: false,
            faculty: Faculty.IT.key,
            hobbyIDs: []
        }).data,
        from({
            id: 5,
            name: 'Trung Nhân',
            age: 21,
            address: 'Q.GV',
            isGraduated: false,
            faculty: Faculty.SALES.key,
            hobbyIDs: [1, 2, 5]
        }).data,
        from({
            id: 6,
            name: 'Quốc Trung',
            age: 21,
            address: 'Q.PN',
            isGraduated: true,
            faculty: Faculty.ART.key,
            hobbyIDs: [1, 2, 3]
        }).data,
        from({
            id: 7,
            name: 'Nguyễn Tú',
            age: 20,
            address: 'Q.12',
            isGraduated: false,
            faculty: Faculty.IT.key,
            hobbyIDs: [2, 4, 5]
        }).data,
        from({
            id: 8,
            name: 'Phạm Tú',
            age: 19,
            address: 'Q.TB',
            isGraduated: false,
            faculty: Faculty.ART.key,
            hobbyIDs: [1, 4]
        }).data,
    ]
}

exports.generateFakeData = generateFakeData
