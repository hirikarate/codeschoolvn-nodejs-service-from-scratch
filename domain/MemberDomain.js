const { MemberRepository } = require('../data-access/MemberRepository')
const m = require('../models/DTO/member.dto')


function validateId(id, errors) {
    if (id == null) return null

    id = parseInt(id)
    if (!Number.isSafeInteger(id)) {
        return errors.push('ID không hợp lệ')
    }
    return id
}

function validateName(name, errors) {
    if (!name) {
        return errors.push('Yêu cầu nhập Họ tên')
    }
    return name
}

function validateAge(age, errors) {
    age = parseInt(age)
    if (!Number.isSafeInteger(age) || age <= 0 || age > 100) {
        return errors.push('Tuổi không hợp lệ')
    }
    return age
}

function validateGraduated(isGraduated, errors) {
    return !!isGraduated // Boolean(isGraduated)
}

function validateFaculty(faculty, errors) {
    if (faculty != null && faculty != '') {
        const isValidEnum = Object.values(Faculty).some(f => f.key === faculty)
        if (!isValidEnum) {
            return errors.push('Chuyên ngành không hợp lệ')
        }
    }
    return faculty
}

function validateHobbies(hobbies, errors) {
    if (!hobbies) {
        return []
    }
    else if (!Array.isArray(hobbies)) {
        hobbies = [hobbies]
    }
    else if (hobbies.length == 0) {
        return hobbies // Hobbies are optional
    }

    const isValidEnum = hobbies.every(hobby => {
        return Object.values(Hobby).some(h => h.key === hobby)
    })
    if (!isValidEnum) {
        return errors.push('Sở thích không hợp lệ')
    }

    return hobbies
}


class MemberDomain {
    
    constructor() {
        this._repo = new MemberRepository()
    }

    /**
     * Fetches all members
     * @param {MemberFindAllQuery} query
     */
    findAll(query) {
        // members: Array of MemberEntity
        const members = this._repo.findAll()
        return new m.MemberFindAllResult(members, members.length)
    }

    /**
     * Searches by member ID, return ONE member if found,
     * otherwise returns `null`.
     * @param {MemberFindByIdQuery} query
     */
    findById(query) {
        const member = this._repo.findById(query.id)
        return new m.MemberFindByIdResult(member)
    }

    /**
     * Checks if there is any member with given ID
     * @param {MemberExistsQuery} query
     */
    exists(query) {
        const isExisting = this._repo.exists(query.id)
        return new m.MemberExistResult(isExisting)
    }

    /**
     * Adds new member
     * @params {MemberModel} New member instance
     */
    create(member) {
        member.id = this._nextId()
        this._members.push(member)
        return member
    }

    /**
     * Updates existing member
     * @params {MemberModel} Modified member instance
     */
    update(member) {
        const found = this._members.find(m => m.id == member.id)
        Object.assign(found, member)
    }

    /**
     * Deletes a member, returns true if success, false if failed.
     * @params {number} id Member ID to delete
     */
    delete(id) {
        const index = this._members.findIndex(m => m.id == id)
        if (index < 0) return false
        this._members.splice(index, 1)
        return true
    }

}

// exports.MemberDomain = MemberDomain
module.exports = { MemberDomain }
