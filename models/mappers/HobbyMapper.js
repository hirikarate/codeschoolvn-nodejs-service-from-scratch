const dto = require('../DTO/hobby.dto')
const { HobbyEntity } = require('../entities/Hobby.entity')


class HobbyMapper {
    fromHobbyDetailToEntity(hobby) {
        if (!hobby) { return null }
        else if (Array.isArray(hobby)) {
            return hobby.map(this.fromHobbyDetailToEntity.bind(this))
        }
        const entity = new HobbyEntity()
        if (hobby.id){
            entity.id = hobby.id
        }
        entity.name = hobby.name
        return entity
    }

    fromEntityToHobbyDetail(entity) {
        if (!entity) { return null }
        else if (Array.isArray(entity)) {
            return entity.map(this.fromEntityToHobbyDetail.bind(this))
        }
        const detail = new dto.HobbyDetail()
        detail.id = entity.id
        detail.name = entity.name
        return detail
    }

    sanitizeHobby(obj) {
        if (!obj) { return null }
        let { id, name } = obj
        const errors = []

        id = validateId(id)
        name = validateName(name, errors)

        if (errors.length) {
            return {
                errors,
                data: null
            }
        }

        let mem
        if (id != null) {
            mem = new dto.HobbyDetail()
            mem.id = id
        }
        else {
            mem = new dto.NewHobby()
        }
        mem.name = name

        return {
            errors: null,
            data: mem
        }
    }
}
exports.HobbyMapper = HobbyMapper


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
        return errors.push('Yêu cầu nhập tên sở thích')
    }
    return name
}
