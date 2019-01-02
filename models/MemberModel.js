const Hobby = require('../models/Hobby.enum')
const Faculty = require('../models/Faculty.enum')

const { MemberDAO: MemberRepository } = require('../data-access/MemberRepository')

class MemberModel {
    static from(obj) {
        if (!obj) { return null }
        let { id, name, age, address, isGraduated, faculty, hobbies } = obj
        const errors = []

        id = validateId(id)
        name = validateName(name, errors)
        age = validateAge(age, errors)
        isGraduated = validateGraduated(isGraduated, errors)
        faculty = validateFaculty(faculty, errors)
        hobbies = validateHobbies(hobbies, errors)

        if (errors.length) {
            return {
                errors,
                data: null
            }
        }

        // No need else
        const mem = new MemberModel
        if (id != null) {
            mem.id = id
        }
        mem.name = name
        mem.age = age
        mem.address = address
        mem.isGraduated = isGraduated
        mem.faculty = faculty
        mem.hobbies = hobbies

        return {
            errors: null,
            data: mem
        }
    }

    constructor() {
        this.name = ''
        this.age = ''
        this.address = ''
        this.isGraduated = false
        this.faculty = ''
        this.hobbies = []
    }

    static findAll() {
        const dao = new MemberDAO()
        return dao.findAll()
    }

    static findById(id) {
        const dao = new MemberDAO()
        return dao.findById(id)
    }

    static exists(id) {
        const dao = new MemberDAO()
        return dao.exists(id)
    }

    static delete(id) {
        const dao = new MemberDAO()
        return dao.delete(id)
    }

    save() {
        const dao = new MemberDAO()
        if (this.id != null) {
            return dao.update(this)
        }
        return dao.create(this)
    }
}

exports.MemberModel = MemberModel