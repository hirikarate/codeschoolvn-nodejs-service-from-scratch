const Hobby = require('../models/Hobby.enum')
const Faculty = require('../models/Faculty.enum')

module.exports = [
    {
        name: 'Hoàng Anh', age: 18, address: 'Q.1', isGraduated: false,
        faculty: Faculty.IT.key,
        hobbies: [Hobby.READING.key, Hobby.FOOTBALL.key]
    },
    {
        name: 'Tấn Đạt', age: 18, address: 'Q.2', isGraduated: true,
        faculty: null,
        hobbies: [Hobby.SWIMMING.key, Hobby.TRAVELLING.key]
    },
    {
        name: 'Minh Mẫn', age: 18, address: 'Q.3', isGraduated: true,
        faculty: Faculty.SALES.key,
        hobbies: [Hobby.SHOPPING.key, Hobby.READING.key, Hobby.FOOTBALL.key]
    },
    {
        name: 'Bảo Nam', age: 18, address: 'Q.4', isGraduated: false,
        faculty: Faculty.IT.key,
        hobbies: []
    },
    {
        name: 'Trung Nhân', age: 18, address: 'Q.GV', isGraduated: false,
        faculty: Faculty.SALES.key,
        hobbies: [Hobby.SWIMMING.key, Hobby.SHOPPING.key, Hobby.READING.key]
    },
    {
        name: 'Quốc Trung', age: 18, address: 'Q.PN', isGraduated: true,
        faculty: Faculty.ART.key,
        hobbies: [Hobby.READING.key, Hobby.FOOTBALL.key, Hobby.SHOPPING.key]
    },
    {
        name: 'Nguyễn Tú', age: 18, address: 'Q.12', isGraduated: false,
        faculty: Faculty.IT.key,
        hobbies: [Hobby.SWIMMING.key, Hobby.SHOPPING.key, Hobby.TRAVELLING.key]
    },
    {
        name: 'Phạm Tú', age: 18, address: 'Q.TB', isGraduated: false,
        faculty: Faculty.ART.key,
        hobbies: [Hobby.READING.key, Hobby.FOOTBALL.key]
    },
]
