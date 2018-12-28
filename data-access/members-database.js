const Hobby = require('../models/Hobby.enum')
const Faculty = require('../models/Faculty.enum')

function generateFakeData() {
    const { MemberModel } = require('../models/MemberModel')
    return [
        MemberModel.from({
            id: 1,
            name: 'Hoàng Anh',
            age: 25,
            address: 'Trần Hưng Đạo, Q.1,\nViệt Nam',
            isGraduated: false,
            faculty: Faculty.IT.key,
            hobbies: [Hobby.READING.key, Hobby.FOOTBALL.key]
        }).data,
        MemberModel.from({
            id: 2,
            name: 'Tấn Đạt',
            age: 22,
            address: 'Q.2',
            isGraduated: true,
            faculty: null,
            hobbies: [Hobby.SWIMMING.key, Hobby.TRAVELLING.key]
        }).data,
        MemberModel.from({
            id: 3,
            name: 'Minh Mẫn',
            age: 28, address: 'Q.3',
            isGraduated: true,
            faculty: Faculty.SALES.key,
            hobbies: [Hobby.SHOPPING.key, Hobby.READING.key, Hobby.FOOTBALL.key]
        }).data,
        MemberModel.from({
            id: 4,
            name: 'Bảo Nam',
            age: 21,
            address: 'Q.4',
            isGraduated: false,
            faculty: Faculty.IT.key,
            hobbies: []
        }).data,
        MemberModel.from({
            id: 5,
            name: 'Trung Nhân',
            age: 21,
            address: 'Q.GV',
            isGraduated: false,
            faculty: Faculty.SALES.key,
            hobbies: [Hobby.SWIMMING.key, Hobby.SHOPPING.key, Hobby.READING.key]
        }).data,
        MemberModel.from({
            id: 6,
            name: 'Quốc Trung',
            age: 21,
            address: 'Q.PN',
            isGraduated: true,
            faculty: Faculty.ART.key,
            hobbies: [Hobby.READING.key, Hobby.FOOTBALL.key, Hobby.SHOPPING.key]
        }).data,
        MemberModel.from({
            id: 7,
            name: 'Nguyễn Tú',
            age: 20,
            address: 'Q.12',
            isGraduated: false,
            faculty: Faculty.IT.key,
            hobbies: [Hobby.SWIMMING.key, Hobby.SHOPPING.key, Hobby.TRAVELLING.key]
        }).data,
        MemberModel.from({
            id: 8,
            name: 'Phạm Tú',
            age: 19,
            address: 'Q.TB',
            isGraduated: false,
            faculty: Faculty.ART.key,
            hobbies: [Hobby.READING.key, Hobby.FOOTBALL.key]
        }).data,
    ]
}

exports.generateFakeData = generateFakeData
