const dto = require('../DTO/member.dto')
const { MemberEntity } = require('../entities/Member.entity')
const Hobby = require('../Hobby.enum')
const Faculty = require('../Faculty.enum')


class MemberMapper {
    fromMemberDetailToEntity(member) {
        if (!member) { return null }
        else if (Array.isArray(member)) {
            return member.map(this.fromMemberDetailToEntity.bind(this))
        }
        const entity = new MemberEntity()
        if (member.id){
            entity.id = member.id
        }
        entity.name = member.name
        entity.age = member.age
        entity.address = member.address
        entity.isGraduated = member.isGraduated
        entity.faculty = member.faculty
        entity.hobbies = member.hobbies
        return entity
    }

    fromEntityToMemberDetail(entity) {
        if (!entity) { return null }
        else if (Array.isArray(entity)) {
            return entity.map(this.fromEntityToMemberDetail.bind(this))
        }
        const detail = new dto.MemberDetail()
        detail.id = entity.id
        detail.name = entity.name
        detail.age = entity.age
        detail.address = entity.address
        detail.isGraduated = entity.isGraduated
        detail.faculty = entity.faculty
        detail.hobbies = entity.hobbies
        return detail
    }

    sanitizeMember(obj) {
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

        let mem
        if (id != null) {
            mem = new dto.MemberDetail()
            mem.id = id
        }
        else {
            mem = new dto.NewMember()
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
}
exports.MemberMapper = MemberMapper


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
