const { FindAllCommand, FindAllResult } = require('./common')



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


class MemberFindAllCommand extends FindAllCommand {
}

exports.MemberFindAllCommand = MemberFindAllCommand


class MemberFindAllResult extends FindAllResult {
}

exports.MemberFindAllResult = MemberFindAllResult

